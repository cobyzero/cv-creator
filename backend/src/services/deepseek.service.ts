import { DEEPSEEK_API_KEY } from "../config/env.js";
import { CvSchema, type CvJson } from "../schemas/cv.schema.js";

const SYS = "Devuelve SOLO JSON valido con schema: personal{nombre,email,telefono,ciudad,linkedin}, resumen, experiencia[{puesto,empresa,fechas,bullets[]}], educacion[], skills[], idiomas[]. Reglas: skills e idiomas son arrays de strings planos (ej. [\"Español (nativo)\", \"Inglés avanzado\"]), nunca objetos. bullets son strings planos. Sin markdown, sin texto fuera del JSON.";

// DeepSeek a veces responde prosa ("Aquí tiene el JSON…"): recorta
// desde el primer { al último } antes de parsear.
function extractJson(txt: string): string {
  const noFence = txt.replace(/```json|```/g, "").trim();
  const start = noFence.indexOf("{");
  const end = noFence.lastIndexOf("}");
  return start >= 0 && end > start ? noFence.slice(start, end + 1) : noFence;
}

async function chat(messages: unknown[], temperature = 0.2): Promise<string> {
  const r = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${DEEPSEEK_API_KEY}` },
    body: JSON.stringify({ model: "deepseek-chat", messages, temperature }),
    signal: AbortSignal.timeout(30000),
  });
  if (!r.ok) throw new Error("deepseek " + r.status);
  const j: any = await r.json();
  return j.choices?.[0]?.message?.content || "";
}

export async function callDeepseek(raw_text: string): Promise<CvJson> {
  if (!DEEPSEEK_API_KEY) throw new Error("falta DEEPSEEK_API_KEY en backend/.env");
  const txt = await chat([
    { role: "system", content: SYS },
    { role: "user", content: raw_text.slice(0, 12000) },
  ]);
  try {
    return CvSchema.parse(JSON.parse(extractJson(txt)));
  } catch {
    const fixed = await chat([{ role: "user", content: "Corrige a JSON valido:\n" + txt }], 0);
    return CvSchema.parse(JSON.parse(extractJson(fixed)));
  }
}
