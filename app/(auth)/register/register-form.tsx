"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function strength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const score = useMemo(() => strength(password), [password]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "No se pudo crear la cuenta");
        return;
      }

      // Auto login tras registro
      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        router.push("/login?registered=1");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Error de red. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Nombre completo</Label>
        <Input
          id="name"
          placeholder="Ana García"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="tu@email.com"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className="text-xs text-zinc-500">Usaremos tu email solo para guardar tus CV.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          <Input
            id="password"
            type={show ? "text" : "password"}
            placeholder="Mín. 8 caracteres"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pr-20"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            {show ? "Ocultar" : "Mostrar"}
          </button>
        </div>

        {password.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition ${
                    i < score ? (score <= 2 ? "bg-amber-500" : score === 3 ? "bg-blue-500" : "bg-emerald-500") : "bg-zinc-200 dark:bg-zinc-800"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-zinc-500">
              {score <= 1 && "Débil — añade mayúsculas, números y símbolos"}
              {score === 2 && "Aceptable — puedes mejorarla"}
              {score === 3 && "Buena — casi perfecta"}
              {score === 4 && "Excelente — muy segura"}
            </p>
          </div>
        )}
      </div>

      <label className="flex items-start gap-2 py-1">
        <input type="checkbox" required className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-700" />
        <span className="text-xs leading-5 text-zinc-600 dark:text-zinc-400">
          Acepto los <a href="#" className="font-medium text-zinc-900 underline underline-offset-2 dark:text-white">Términos</a> y la{" "}
          <a href="#" className="font-medium text-zinc-900 underline underline-offset-2 dark:text-white">Política de Privacidad</a>.
        </span>
      </label>

      <Button type="submit" size="lg" className="w-full rounded-xl" disabled={loading}>
        {loading ? "Creando cuenta..." : "Crear cuenta gratis"}
      </Button>

      <p className="text-center text-xs text-zinc-500">✓ Gratis para siempre • ✓ Cancela cuando quieras • ✓ Exportación PDF ilimitada</p>
    </form>
  );
}
