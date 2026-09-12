import pdf from "pdf-parse";
import { textHash } from "../utils/hash.js";

export type ParsedPdf = { raw_text: string; scanned: boolean; hash: string };

// PDF -> texto plano (100% local, sin IA).
export async function parsePdf(buffer: Buffer): Promise<ParsedPdf> {
  const parsed = await pdf(buffer);
  const raw_text = (parsed.text || "").trim();
  return { raw_text, scanned: raw_text.length < 50, hash: textHash(raw_text) };
}
