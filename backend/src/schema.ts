import { z } from "zod";
export const CvSchema = z.object({
  personal: z.object({ nombre: z.string(), email: z.string().optional(), telefono: z.string().optional(), ciudad: z.string().optional(), linkedin: z.string().optional() }),
  resumen: z.string().default(""),
  experiencia: z.array(z.object({ puesto: z.string(), empresa: z.string(), fechas: z.string().optional(), bullets: z.array(z.string()).default([]) })).default([]),
  educacion: z.array(z.object({ titulo: z.string(), centro: z.string().optional(), fechas: z.string().optional() })).default([]),
  skills: z.array(z.string()).default([]),
  idiomas: z.array(z.string()).default([])
});
export type CvJson = z.infer<typeof CvSchema>;
