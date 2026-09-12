import { z } from "zod";
import { CvSchema } from "./cv.schema.js";

// Respuesta del sastre: CV adaptado + en qué requisito eres más débil.
export const TailorSchema = z.object({
  cv: CvSchema,
  debilidad: z.preprocess(
    (v) => (typeof v === "string" ? v : ""),
    z.string().default(""),
  ),
  cambios: z.preprocess(
    (v) => (Array.isArray(v) ? v.filter((x) => typeof x === "string") : []),
    z.array(z.string()).default([]),
  ),
});
export type Tailored = z.infer<typeof TailorSchema>;
