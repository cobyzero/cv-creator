import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { SocialButtons, Divider } from "@/components/auth/social-buttons";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Iniciar sesión — cvcraft",
  description: "Accede a tu cuenta para seguir creando tu CV profesional.",
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Bienvenido de nuevo"
      subtitle="Inicia sesión para continuar con tu CV. Te estabamos esperando."
    >
      <SocialButtons />
      <Divider />

      <Suspense fallback={<div className="h-40 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />}>
        <LoginForm />
      </Suspense>

      <p className="mt-6 text-center text-sm text-zinc-500">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="font-medium text-zinc-900 underline underline-offset-4 hover:text-zinc-700 dark:text-white">
          Crea una gratis
        </Link>
      </p>
    </AuthLayout>
  );
}
