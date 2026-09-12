import { z } from "zod";

// DeepSeek a veces devuelve objetos donde pedimos strings
// (ej. idiomas: [{idioma:"Español", nivel:"nativo"}]).
// asText los aplana a "Español (nativo)" en vez de romper el parse.
function asText(v: unknown): string {
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    const base = [o.idioma, o.nombre, o.name, o.skill, o.texto, o.text, o.descripcion, o.titulo]
      .find((x): x is string => typeof x === "string" && x.length > 0);
    const nivel = [o.nivel, o.level]
      .find((x): x is string => typeof x === "string" && x.length > 0);
    if (base) return nivel ? `${base} (${nivel})` : base;
    return Object.values(o).filter((x): x is string => typeof x === "string").join(" ");
  }
  return "";
}

const FlexStr = z.any().transform(asText);
const FlexStrArray = z.preprocess(
  (v) => (Array.isArray(v) ? v : []),
  z.array(FlexStr).default([]),
);
const OptStr = z.preprocess(
  (v) => (v == null || (typeof v === "object" && !Array.isArray(v)) ? undefined : v),
  z.union([z.string(), z.number().transform(String)]).optional(),
);

export const CvSchema = z.object({
  personal: z.object({ nombre: z.string(), email: OptStr, telefono: OptStr, ciudad: OptStr, linkedin: OptStr }),
  resumen: z.preprocess((v) => (typeof v === "string" ? v : ""), z.string().default("")),
  experiencia: z.preprocess(
    (v) => (Array.isArray(v) ? v.filter((x) => x && typeof x === "object") : v),
    z.array(z.object({
      puesto: z.preprocess((v) => (typeof v === "string" ? v : asText(v) || "Sin puesto"), z.string()),
      empresa: z.preprocess((v) => (typeof v === "string" ? v : asText(v) || "Sin empresa"), z.string()),
      fechas: OptStr,
      bullets: FlexStrArray,
    })).default([]),
  ),
  educacion: z.preprocess(
    (v) => (Array.isArray(v) ? v.filter((x) => x && typeof x === "object") : v),
    z.array(z.object({ titulo: z.preprocess((v) => (typeof v === "string" ? v : asText(v) || "Sin título"), z.string()), centro: OptStr, fechas: OptStr })).default([]),
  ),
  skills: FlexStrArray,
  idiomas: FlexStrArray,
});
export type CvJson = z.infer<typeof CvSchema>;
