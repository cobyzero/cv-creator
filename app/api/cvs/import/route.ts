import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { defaultCvData } from "@/lib/cv/defaults";

export const runtime = "nodejs";
export const maxDuration = 30;

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";
const MODEL = process.env.DEEPSEEK_MODEL || "deepseek-chat";

const SYSTEM_PROMPT = `Eres un experto en extraer datos estructurados de CVs en PDF.
Recibirás el texto plano extraído de un PDF. Debes devolver SOLO JSON válido (sin markdown) con esta estructura exacta, sin inventar datos que no estén en el texto:

{
  "personal": { "fullName": "string", "role": "string", "location": "string", "email": "string", "phone": "string", "website": "string", "linkedin": "string", "github": "string", "summary": "string" },
  "experience": [{ "role": "string", "company": "string", "location": "string", "startDate": "YYYY-MM", "endDate": "YYYY-MM", "current": false, "description": "string" }],
  "education": [{ "degree": "string", "school": "string", "location": "string", "startDate": "YYYY-MM", "endDate": "YYYY-MM", "description": "string" }],
  "projects": [{ "name": "string", "technologies": ["string"], "description": "string", "link": "" }],
  "certifications": [{ "name": "string", "issuer": "string", "date": "YYYY-MM", "link": "" }],
  "skills": [{ "name": "string", "category": "General" }],
  "languages": [{ "name": "string", "level": "string" }],
  "lang": "es|en"
}

Reglas:
- Si no encuentras un campo, usa "" o [].
- Fechas: convierte "Mar 2022" o "2020-03" a "YYYY-MM". Si solo hay año, usa "YYYY-01". Si es Actual/Present, pon current:true y endDate "".
- Summary: resume en 2-3 líneas si el CV tiene resumen; si no, genera uno breve basado en rol y experiencia, sin inventar métricas.
- Skills: extrae todas las habilidades técnicas mencionadas, normalizadas (ej: "React", "Figma").
- Lang: detecta idioma predominante del CV (es o en).
- No inventes empresas, títulos o métricas. Solo extrae lo que está en el texto.
- Devuelve solo JSON.`;

async function extractWithDeepSeek(text: string) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY no configurada. Configúrala en .env para importar PDFs con IA.");

  const res = await fetch(DEEPSEEK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Texto extraído del PDF (primeras 8000 chars):\n\n${text.slice(0, 8000)}\n\nDevuelve solo JSON.` },
      ],
      temperature: 0.2,
      max_tokens: 4000,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`DeepSeek ${res.status}: ${t.slice(0, 300)}`);
  }
  const data = await res.json();
  const content: string = data.choices?.[0]?.message?.content || "";
  const jsonStr = content.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
  const parsed = JSON.parse(jsonStr);
  if (!parsed.personal) throw new Error("Respuesta incompleta");
  return parsed;
}

function fallbackHeuristic(text: string) {
  // Muy básico: intenta extraer email, nombre de primera línea
  const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const fullName = lines[0]?.slice(0, 60) || "Importado";
  return {
    personal: {
      fullName,
      role: "",
      location: "",
      email,
      phone: text.match(/\+?[\d\s\-()]{8,}/)?.[0]?.slice(0, 20) || "",
      website: "",
      linkedin: "",
      github: "",
      summary: lines.slice(1, 4).join(" ").slice(0, 300) || "",
    },
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    skills: [],
    languages: [],
    lang: "es" as const,
  };
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  let pdfText = "";
  let fileName = "CV Importado";
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "Falta archivo PDF (campo 'file')" }, { status: 400 });
    if (file.size > 8 * 1024 * 1024) return NextResponse.json({ error: "PDF muy grande (máx 8MB)" }, { status: 400 });
    if (!file.type.includes("pdf") && !file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "Solo se aceptan PDFs" }, { status: 400 });
    }
    fileName = file.name.replace(/\.pdf$/i, "") || fileName;

    const arrayBuffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);

    // unpdf: sin worker, funciona en Node/Turbopack
    const { extractText } = await import("unpdf");
    const result = (await extractText(uint8, { mergePages: true })) as unknown as { text: string | string[] };
    const raw = result.text as unknown;
    pdfText = (typeof raw === "string" ? raw : Array.isArray(raw) ? (raw as string[]).join("\n") : "").trim();
    if (!pdfText || pdfText.length < 20) {
      return NextResponse.json({ error: "No se pudo extraer texto del PDF (¿es escaneado?)" }, { status: 400 });
    }
  } catch (e) {
    console.error("[import] pdf parse", e);
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error al leer PDF" }, { status: 400 });
  }

  // Extrae datos
  let extracted: Record<string, unknown>;
  let source: "deepseek" | "fallback" = "deepseek";
  let warning: string | undefined;
  try {
    extracted = await extractWithDeepSeek(pdfText);
  } catch (e) {
    console.warn("[import] deepseek fallback", e);
    extracted = fallbackHeuristic(pdfText) as Record<string, unknown>;
    source = "fallback";
    warning = e instanceof Error ? e.message : "Usando extracción básica (configura DEEPSEEK_API_KEY para mejor resultado)";
  }

  // Normaliza y añade IDs
  const now = Date.now();
  const withIds = {
    personal: {
      fullName: (extracted as { personal?: { fullName?: string } }).personal?.fullName || "Importado",
      role: (extracted as { personal?: { role?: string } }).personal?.role || "",
      location: (extracted as { personal?: { location?: string } }).personal?.location || "",
      email: (extracted as { personal?: { email?: string } }).personal?.email || "",
      phone: (extracted as { personal?: { phone?: string } }).personal?.phone || "",
      website: (extracted as { personal?: { website?: string } }).personal?.website || "",
      linkedin: (extracted as { personal?: { linkedin?: string } }).personal?.linkedin || "",
      github: (extracted as { personal?: { github?: string } }).personal?.github || "",
      summary: (extracted as { personal?: { summary?: string } }).personal?.summary || "",
    },
    experience: ((extracted as { experience?: unknown[] }).experience || []).map((e: unknown, i: number) => {
      const exp = e as Record<string, unknown>;
      return {
        id: `exp${now + i}`,
        role: String(exp.role || ""),
        company: String(exp.company || ""),
        location: String(exp.location || ""),
        startDate: String(exp.startDate || ""),
        endDate: String(exp.endDate || ""),
        current: Boolean(exp.current),
        description: String(exp.description || ""),
      };
    }),
    education: ((extracted as { education?: unknown[] }).education || []).map((e: unknown, i: number) => {
      const edu = e as Record<string, unknown>;
      return {
        id: `edu${now + i}`,
        degree: String(edu.degree || ""),
        school: String(edu.school || ""),
        location: String(edu.location || ""),
        startDate: String(edu.startDate || ""),
        endDate: String(edu.endDate || ""),
        description: String(edu.description || ""),
      };
    }),
    projects: ((extracted as { projects?: unknown[] }).projects || []).map((p: unknown, i: number) => {
      const proj = p as Record<string, unknown>;
      return {
        id: `proj${now + i}`,
        name: String(proj.name || ""),
        technologies: Array.isArray(proj.technologies) ? (proj.technologies as string[]).map(String) : [],
        description: String(proj.description || ""),
        link: String(proj.link || ""),
      };
    }),
    certifications: ((extracted as { certifications?: unknown[] }).certifications || []).map((c: unknown, i: number) => {
      const cert = c as Record<string, unknown>;
      return {
        id: `cert${now + i}`,
        name: String(cert.name || ""),
        issuer: String(cert.issuer || ""),
        date: String(cert.date || ""),
        link: String(cert.link || ""),
      };
    }),
    skills: ((extracted as { skills?: unknown[] }).skills || []).map((s: unknown, i: number) => {
      const skill = s as Record<string, unknown>;
      const name = typeof skill === "string" ? skill : String(skill.name || "");
      return { id: `s${now + i}`, name, category: String((skill as { category?: string }).category || "General") };
    }),
    languages: ((extracted as { languages?: unknown[] }).languages || []).map((l: unknown, i: number) => {
      const lang = l as Record<string, unknown>;
      return { id: `l${now + i}`, name: String(lang.name || ""), level: String(lang.level || "") };
    }),
  };

  const lang = (extracted as { lang?: string }).lang === "en" ? "en" : "es";

  // Crea CV en DB
  const cv = await prisma.cv.create({
    data: {
      userId,
      title: fileName.slice(0, 80) || "CV Importado",
      template: "minimal",
      lang,
      data: withIds as object,
    },
  });

  return NextResponse.json({
    cv: { ...cv, data: withIds },
    source,
    warning,
    extractedChars: pdfText.length,
  });
}
