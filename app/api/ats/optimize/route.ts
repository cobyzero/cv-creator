import { NextResponse } from "next/server";
import { z } from "zod";
import { CvData } from "@/lib/cv/types";

const bodySchema = z.object({
  jobText: z.string().min(10).max(8000),
  cvData: z.custom<CvData>(),
  jobIntelligence: z
    .object({
      role: z.string(),
      requiredSkills: z.array(z.string()),
      preferredSkills: z.array(z.string()),
      keywords: z.array(z.string()),
    })
    .passthrough()
    .optional(),
});

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";
const MODEL = process.env.DEEPSEEK_MODEL || "deepseek-chat";

const SYSTEM_PROMPT = `Eres un experto en optimización de CVs para ATS. Tu tarea es REESCRIBIR el CV existente para que concuerde MEJOR con la oferta, SIN INVENTAR información.

REGLAS ABSOLUTAS:
- NUNCA inventes experiencia, empresas, títulos, fechas, skills, certificaciones, métricas o educación que no estén en el CV original.
- Solo puedes: reordenar, reformular, enfatizar, usar sinónimos presentes en la oferta, y reescribir descripciones para incluir keywords donde haya evidencia real.
- Si el CV no tiene una skill requerida, NO la añadas. Solo puedes destacar si ya existe.
- Mantén todas las secciones y el número de experiencias/proyectos. No añadas nuevas.
- Usa títulos profesionales reconocibles, no "Ninja".
- Salida: SOLO JSON válido con la misma estructura del CV de entrada, sin markdown.

Formato de salida JSON:
{
  "personal": { "fullName": "...", "role": "...", "location": "...", "email": "...", "phone": "...", "website": "...", "linkedin": "...", "github": "...", "summary": "..." },
  "experience": [{ "id": "...", "role": "...", "company": "...", "location": "...", "startDate": "...", "endDate": "...", "current": true/false, "description": "..." }],
  "education": [...],
  "projects": [{ "id": "...", "name": "...", "technologies": [...], "description": "...", "link": "..." }],
  "certifications": [...],
  "skills": [{ "id": "...", "name": "...", "category": "..." }],
  "languages": [...]
}

Instrucciones de reescritura:
1. Personal.summary: genera 2-3 líneas con rol + años + tecnologías clave de la oferta que SÍ estén en el CV + dominio. Concreto, no genérico.
2. Experience.description: transforma cada descripción a formato “Developed/Built/Led ... using X, integrating Y...” incluyendo keywords de la oferta solo si la skill existe en el CV original (skills o proyectos).
3. Projects.description: asegúrate que cada tecnología de la oferta que ya esté en el CV aparezca con contexto.
4. Skills: reordena para que las requiredSkills que ya existen aparezcan primero. No añadas nuevas.
5. Mantén IDs originales.`;

function localOptimize(cvData: CvData, jobText: string, jobIntel?: { requiredSkills: string[]; keywords: string[]; role: string }): CvData {
  const lowerJob = jobText.toLowerCase();
  const required = jobIntel?.requiredSkills || [];
  // Reordena skills: los que están en la oferta primero
  const skills = [...cvData.skills].sort((a, b) => {
    const aIn = required.some((r) => r.toLowerCase() === a.name.toLowerCase() || lowerJob.includes(a.name.toLowerCase()));
    const bIn = required.some((r) => r.toLowerCase() === b.name.toLowerCase() || lowerJob.includes(b.name.toLowerCase()));
    if (aIn && !bIn) return -1;
    if (!aIn && bIn) return 1;
    return 0;
  });

  // Mejora summary si es genérico: añade keywords que ya existen en el CV
  let summary = cvData.personal.summary;
  const existingSkills = cvData.skills.map((s) => s.name.toLowerCase());
  const matchingKeywords = required.filter((k) => existingSkills.includes(k.toLowerCase())).slice(0, 3);
  if (matchingKeywords.length > 0 && !lowerJob.split(" ").every((w) => summary.toLowerCase().includes(w))) {
    // No sobrescribas, solo sugiere: añade al final si no está
    const hasKeywordInSummary = matchingKeywords.some((k) => summary.toLowerCase().includes(k.toLowerCase()));
    if (!hasKeywordInSummary && summary.length < 800) {
      summary = summary.replace(/\.$/, "") + ` Experiencia con ${matchingKeywords.join(", ")}.`;
    }
  }

  // Ajusta role si el CV tiene un título genérico y la oferta es específica, pero solo si hay evidencia en skills
  let role = cvData.personal.role;
  if (jobIntel?.role && required.some((r) => existingSkills.includes(r.toLowerCase())) && !role.toLowerCase().includes(jobIntel.role.toLowerCase().split(" ")[0])) {
    // No reemplaces, solo mantén — la optimización real la hace la IA con contexto
  }

  return {
    ...cvData,
    personal: { ...cvData.personal, summary, role },
    skills,
  };
}

async function callDeepSeek(jobText: string, cvData: CvData): Promise<CvData> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY no configurada");

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
        {
          role: "user",
          content: `OFERTA:\n${jobText}\n\nCV ACTUAL (JSON):\n${JSON.stringify(cvData, null, 2)}\n\nDevuelve solo el JSON optimizado.`,
        },
      ],
      temperature: 0.3,
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
  const parsed = JSON.parse(jsonStr) as CvData;

  // Validación mínima: debe tener personal y arrays
  if (!parsed.personal || !Array.isArray(parsed.experience) || !Array.isArray(parsed.skills)) {
    throw new Error("Respuesta DeepSeek incompleta");
  }
  // Preserva IDs originales si la IA los cambió
  const preserveIds = (orig: { id: string }[], updated: { id: string }[]) =>
    updated.map((u, i) => ({ ...(u as object), id: orig[i]?.id || u.id })) as typeof orig;
  return {
    ...parsed,
    experience: preserveIds(cvData.experience as { id: string }[], parsed.experience as { id: string }[]),
    education: preserveIds(cvData.education as { id: string }[], parsed.education as { id: string }[]),
    projects: preserveIds(cvData.projects as { id: string }[], parsed.projects as { id: string }[]),
    skills: preserveIds(cvData.skills as { id: string }[], parsed.skills as { id: string }[]),
    certifications: preserveIds(cvData.certifications as { id: string }[], parsed.certifications as { id: string }[]),
    languages: preserveIds(cvData.languages as { id: string }[], parsed.languages as { id: string }[]),
  } as unknown as CvData;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos", issues: parsed.error.flatten() }, { status: 400 });
    }
    const { jobText, cvData, jobIntelligence } = parsed.data;

    // Si no hay key, fallback local
    if (!process.env.DEEPSEEK_API_KEY) {
      const optimized = localOptimize(cvData, jobText, jobIntelligence as never);
      return NextResponse.json({
        cvData: optimized,
        source: "fallback",
        warning: "DEEPSEEK_API_KEY no configurada — optimización local (reordena skills, mejora summary). Configura la key para reescritura con IA.",
        changes: ["Reordenó skills según la oferta", "Mejoró summary con keywords existentes (sin inventar)"],
      });
    }

    try {
      const optimized = await callDeepSeek(jobText, cvData);
      return NextResponse.json({
        cvData: optimized,
        source: "deepseek",
        changes: [
          "Reescribió Summary con posicionamiento para la oferta",
          "Reformuló Experience/Projects para incluir keywords con contexto",
          "Reordenó Skills priorizando las requeridas",
        ],
      });
    } catch (e) {
      console.warn("[ATS optimize] fallback", e);
      const optimized = localOptimize(cvData, jobText, jobIntelligence as never);
      return NextResponse.json({
        cvData: optimized,
        source: "fallback",
        warning: `DeepSeek no disponible (${e instanceof Error ? e.message : "error"}), aplicado fallback local.`,
        changes: ["Reordenó skills", "Ajuste menor de summary"],
      });
    }
  } catch (err) {
    console.error("[ATS optimize]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
