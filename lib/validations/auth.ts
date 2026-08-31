import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres").max(60),
  email: z.string().email("Email inválido").toLowerCase(),
  password: z.string().min(8, "Mínimo 8 caracteres").max(72),
});

export const loginSchema = z.object({
  email: z.string().email("Email inválido").toLowerCase(),
  password: z.string().min(1, "Contraseña requerida"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
