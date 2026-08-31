import { TemplatePicker } from "@/components/dashboard/template-picker";

export const metadata = {
  title: "Nuevo CV — Elige plantilla",
};

export default function NewCvPage() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto w-full max-w-5xl px-6 py-8 sm:px-8 sm:py-10">
        <div className="mb-8">
          <a href="/dashboard" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
            ← Volver al dashboard
          </a>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">Elige una plantilla base</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Empieza con una base limpia y optimizada para ATS. Podrás cambiar la plantilla y los colores en cualquier momento sin perder contenido.
          </p>
        </div>

        <TemplatePicker />
      </div>
    </div>
  );
}
