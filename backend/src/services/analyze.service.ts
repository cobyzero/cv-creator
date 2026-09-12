import { randomUUID } from "node:crypto";
import { db } from "../db.js";
import { textHash } from "../utils/hash.js";
import type { CvJson } from "../schemas/cv.schema.js";
import { callDeepseek } from "./deepseek.service.js";

export type Analysis = { cv_json: CvJson; cached: boolean; hash: string };

// Texto -> JSON: reutiliza el análisis guardado si la firma coincide,
// si no llama a DeepSeek y lo guarda para la próxima.
export async function analyzeText(raw_text: string, filename = ""): Promise<Analysis> {
  const hash = textHash(raw_text);
  const hit = db.prepare("SELECT json_result FROM imports WHERE hash=?").get(hash) as any;
  if (hit?.json_result) return { cv_json: JSON.parse(hit.json_result), cached: true, hash };
  const json = await callDeepseek(raw_text);
  db.prepare("INSERT OR IGNORE INTO imports VALUES(?,?,?,?,?,?)").run(
    randomUUID(), filename, raw_text.slice(0, 5000), JSON.stringify(json).slice(0, 20000),
    new Date().toISOString(), hash,
  );
  return { cv_json: json, cached: false, hash };
}
