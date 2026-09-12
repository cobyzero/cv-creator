import { createHash } from "node:crypto";

// Firma estable del texto: normaliza espacios para que el mismo
// CV con distinto formato no dispare otra llamada a la IA.
export function textHash(s: string): string {
  return createHash("sha256")
    .update(s.normalize("NFC").replace(/\s+/g, " ").trim())
    .digest("hex");
}
