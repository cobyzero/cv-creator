import { NextResponse } from "next/server";
import { z } from "zod";
import { parseJobOffer } from "@/lib/ats/job-parser";
import type { JobIntelligence } from "@/lib/ats/types";

const bodySchema = z.object({
  jobText: z.string().min(10, "Oferta muy corta").max(8000),
});

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";
const MODEL = process.env.DEEPSEEK_MODEL || "deepseek-chat";

const SYSTEM_PROMPT = `Eres un experto en ATS, reclutamiento y análisis de ofertas laborales. Analiza la oferta y devuelve SOLO JSON válido (sin markdown) con esta estructura exacta:
{
  "role": "string - título normalizado del puesto (ej: Flutter Developer)",
  "seniority": "Junior|Mid|Senior|Lead|Unknown",
  "requiredSkills": ["string", ...], // skills obligatorias, normalizadas, sin duplicados, 3-10 items
  "preferredSkills": ["string", ...], // nice to have, 0-6 items
  "keywords": ["string", ...], // 5-10 keywords semánticas incluyendo dominio (ej: Mobile Development, API Integration)
  "relatedTitles": ["string", ...], // 3-5 títulos relacionados buscables
  "summary": "string - resumen de 1 línea de la oferta"
}
Reglas:
- No inventes skills que no estén en la oferta.
- Normaliza: "REST APIs" no "rest apis", "CI/CD" no "cicd".
- Si la oferta menciona "Flutter/Dart" extrae ambos por separado.
- Seniority: detecta Junior/Mid/Senior/Lead por el texto.
- RelatedTitles: títulos que un reclutador usaría para buscar este rol.
- Devuelve solo JSON.`;

function fallback(jobText: string): JobIntelligence & { summary?: string; source: "fallback" | "deepseek" } {
  const parsed = parseJobOffer(jobText);
  return { ...parsed, summary: `${parsed.role} · ${parsed.seniority}`, source: "fallback" };
}

async function callDeepSeek(jobText: string): Promise<JobIntelligence & { summary?: string; source: "deepseek" }> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY no configurada");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
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
          { role: "user", content: `Oferta a analizar:\n\n${jobText}\n\nDevuelve solo JSON.` },
        ],
        temperature: 0.2,
        max_tokens: 1200,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`DeepSeek ${res.status}: ${text.slice(0, 400)}`);
    }

    const data = await res.json();
    const content: string = data.choices?.[0]?.message?.content || "";
    // Limpia posible markdown
    const jsonStr = content.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
    const parsed = JSON.parse(jsonStr);

    // Valida estructura mínima
    if (!parsed.role || !Array.isArray(parsed.requiredSkills)) throw new Error("Respuesta DeepSeek incompleta");

    return {
      role: String(parsed.role).slice(0, 80),
      seniority: ["Junior", "Mid", "Senior", "Lead", "Unknown"].includes(parsed.seniority) ? parsed.seniority : "Unknown",
      requiredSkills: (parsed.requiredSkills as string[]).slice(0, 12).map((s) => String(s).trim()).filter(Boolean),
      preferredSkills: (parsed.preferredSkills as string[] || []).slice(0, 8).map((s) => String(s).trim()).filter(Boolean),
      keywords: (parsed.keywords as string[] || []).slice(0, 12).map((s) => String(s).trim()).filter(Boolean),
      relatedTitles: (parsed.relatedTitles as string[] || []).slice(0, 6).map((s) => String(s).trim()).filter(Boolean),
      rawText: jobText,
      summary: parsed.summary ? String(parsed.summary).slice(0, 200) : undefined,
      source: "deepseek",
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "jobText inválido", issues: parsed.error.flatten() }, { status: 400 });
    }

    const { jobText } = parsed.data;

    // Si no hay key, fallback inmediato (no error)
    if (!process.env.DEEPSEEK_API_KEY) {
      const job = fallback(jobText);
      return NextResponse.json({ job, warning: "DEEPSEEK_API_KEY no configurada — usando parser local. Añádela a .env para análisis con IA." });
    }

    try {
      const job = await callDeepSeek(jobText);
      return NextResponse.json({ job });
    } catch (e) {
      console.warn("[ATS DeepSeek] fallback por error:", e instanceof Error ? e.message : e);
      const job = fallback(jobText);
      return NextResponse.json({
        job,
        warning: `DeepSeek no disponible (${e instanceof Error ? e.message : "error"}), usando parser local.`,
      });
    }
  } catch (err) {
    console.error("[ATS analyze]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
