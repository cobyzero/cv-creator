import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { SocialButtons, Divider } from "@/components/auth/social-buttons";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Crear cuenta — cvcraft",
  description: "Crea tu cuenta gratis y construye tu CV profesional en minutos.",
};

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Crea tu cuenta gratis"
      subtitle="Empieza tu CV en 30 segundos. Sin tarjeta, sin spam."
    >
      <SocialButtons />
      <Divider text="o regístrate con email" />

      <RegisterForm />

      <p className="mt-6 text-center text-sm text-zinc-500">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-medium text-zinc-900 underline underline-offset-4 hover:text-zinc-700 dark:text-white">
          Inicia sesión
        </Link>
      </p>
    </AuthLayout>
  );
}
