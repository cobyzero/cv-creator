"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CvLang, CvTemplate } from "@/lib/cv/types";

const TEMPLATES: {
  id: CvTemplate;
  name: string;
  desc: string;
  badge: string;
  accent: string;
  preview: string;
}[] = [
  {
    id: "minimal",
    name: "Minimal Pro",
    desc: "Limpio, tipográfico y ATS-first. Ideal para tech y producto.",
    badge: "Más popular",
    accent: "bg-zinc-900",
    preview: "Minimal",
  },
  {
    id: "executive",
    name: "Executive",
    desc: "Estructura corporativa con barra lateral. Perfecta para management.",
    badge: "Corporativo",
    accent: "bg-blue-600",
    preview: "Executive",
  },
  {
    id: "creative",
    name: "Creative Flow",
    desc: "Toques de color y layout expresivo para diseño y marketing.",
    badge: "Diseño",
    accent: "bg-violet-600",
    preview: "Creative",
  },
];

export function TemplatePicker() {
  const router = useRouter();
  const [selected, setSelected] = useState<CvTemplate>("minimal");
  const [lang, setLang] = useState<CvLang>("es");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(useTemplate: CvTemplate = selected) {
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/cvs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template: useTemplate, lang, title: `Mi CV - ${TEMPLATES.find((t) => t.id === useTemplate)?.name}` }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo crear");
      router.push("/dashboard");
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
        <span className="text-xs font-semibold">Idioma de la plantilla:</span>
        <div className="flex gap-1 rounded-full bg-zinc-100 p-1 dark:bg-zinc-800">
          {(["es", "en"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`rounded-full px-3 py-1 text-xs font-medium ${lang === l ? "bg-white shadow dark:bg-zinc-900" : "text-zinc-500"}`}
            >
              {l === "es" ? "ES — Español" : "EN — English"}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs text-zinc-500">Secciones se traducirán: {lang === "es" ? "Resumen, Habilidades..." : "Summary, Skills..."}</span>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelected(t.id)}
            className={`group relative flex flex-col rounded-2xl border bg-white p-3 text-left transition dark:bg-zinc-900 ${
              selected === t.id ? "border-zinc-900 ring-2 ring-zinc-900 dark:border-white dark:ring-white" : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800"
            }`}
          >
            {selected === t.id && (
              <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 text-xs text-white dark:bg-white dark:text-zinc-900">
                ✓
              </span>
            )}
            <div className="relative overflow-hidden rounded-xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
              <div className={`h-1.5 w-full rounded ${t.accent}`} />
              <div className="mt-4 flex gap-3">
                <div className="h-10 w-10 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
                <div className="space-y-2">
                  <div className="h-2 w-20 rounded bg-zinc-900 dark:bg-white" />
                  <div className="h-1.5 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
                </div>
              </div>
              <div className="mt-5 space-y-2">
                <div className="h-1.5 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-1.5 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-1.5 w-4/6 rounded bg-zinc-200 dark:bg-zinc-800" />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 rounded-lg border border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-900" />
                ))}
              </div>
            </div>

            <div className="px-1 pb-1 pt-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">{t.name}</h3>
                <span className="rounded-full border border-zinc-200 px-2 py-0.5 text-xs dark:border-zinc-700">{t.badge}</span>
              </div>
              <p className="mt-1 text-xs leading-5 text-zinc-500">{t.desc}</p>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreate(t.id);
                }}
                className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
              >
                Usar esta plantilla
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">✦</div>
          <div>
            <p className="text-sm font-semibold">Seleccionado: {TEMPLATES.find((t) => t.id === selected)?.name} · {lang.toUpperCase()}</p>
            <p className="text-xs text-zinc-500">Se guardará en {lang === "es" ? "español" : "inglés"} · Secciones traducidas.</p>
          </div>
        </div>
        <div className="flex w-full gap-3 sm:w-auto">
          <a href="/dashboard" className="inline-flex flex-1 items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 py-2.5 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 sm:flex-none">
            Cancelar
          </a>
          <button
            onClick={() => handleCreate()}
            disabled={creating}
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 sm:flex-none"
          >
            {creating ? "Creando..." : "Crear CV y editar →"}
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-zinc-500">Todas las plantillas son 100% editables y optimizadas para ATS. Cambia de plantilla en el editor sin perder datos.</p>
    </div>
  );
}
