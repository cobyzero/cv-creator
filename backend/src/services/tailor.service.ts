import { randomUUID } from "node:crypto";
import { DEEPSEEK_API_KEY } from "../config/env.js";
import { db } from "../db.js";
import { textHash } from "../utils/hash.js";
import type { CvJson } from "../schemas/cv.schema.js";
import { TailorSchema, type Tailored } from "../schemas/tailor.schema.js";

const SYS = `Actúa como un reclutador senior que revisa 200 CV al día.
Adapta el CV específicamente al puesto: usa las palabras clave de la vacante, convierte responsabilidades en logros medibles, elimina lo genérico y mantenlo en una página.
Devuelve SOLO JSON válido con esta forma exacta:
{"cv": {personal{nombre,email,telefono,ciudad,linkedin}, resumen, experiencia[{puesto,empresa,fechas,bullets[]}], educacion[], skills[], idiomas[]}, "debilidad": "en qué requisito de la vacante el candidato es más débil y por qué", "cambios": ["lista de los cambios clave que hiciste"]}.
Reglas: skills e idiomas son arrays de strings planos (ej. ["Español (nativo)"]), bullets son strings planos. Sin markdown, sin texto fuera del JSON.`;

async function chat(content: string, temperature = 0.2): Promise<string> {
  const r = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${DEEPSEEK_API_KEY}` },
    body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "system", content: SYS }, { role: "user", content }], temperature }),
    signal: AbortSignal.timeout(45000),
  });
  if (!r.ok) throw new Error("deepseek " + r.status);
  const j: any = await r.json();
  return j.choices?.[0]?.message?.content || "";
}

function extractJson(txt: string): string {
  const noFence = txt.replace(/```json|```/g, "").trim();
  const start = noFence.indexOf("{");
  const end = noFence.lastIndexOf("}");
  return start >= 0 && end > start ? noFence.slice(start, end + 1) : noFence;
}

export type TailorResult = Tailored & { cached: boolean; hash: string };

// Misma firma → mismo resultado: no se paga la IA dos veces.
export async function tailorToJob(cv: CvJson, vacante: string): Promise<TailorResult> {
  if (!DEEPSEEK_API_KEY) throw new Error("falta DEEPSEEK_API_KEY en backend/.env");
  const v = vacante.normalize("NFC").replace(/\s+/g, " ").trim();
  if (v.length < 30) throw new Error("la vacante es muy corta: pega la descripción completa");
  const hash = textHash(JSON.stringify(cv) + "§§" + v);
  const hit = db.prepare("SELECT json_result FROM imports WHERE hash=?").get(hash) as any;
  if (hit?.json_result) return { ...JSON.parse(hit.json_result), cached: true, hash };
  const user = `Este es mi CV (JSON):\n${JSON.stringify(cv).slice(0, 8000)}\n\nEsta es la vacante:\n${v.slice(0, 8000)}`;
  const first = await chat(user);
  let parsed: Tailored;
  try {
    parsed = TailorSchema.parse(JSON.parse(extractJson(first)));
  } catch {
    const fixed = await chat("Corrige a JSON valido con la forma {cv, debilidad, cambios}:\n" + first, 0);
    parsed = TailorSchema.parse(JSON.parse(extractJson(fixed)));
  }
  db.prepare("INSERT OR IGNORE INTO imports VALUES(?,?,?,?,?,?)").run(
    randomUUID(), "tailor", (user).slice(0, 5000), JSON.stringify(parsed).slice(0, 20000),
    new Date().toISOString(), hash,
  );
  return { ...parsed, cached: false, hash };
}
