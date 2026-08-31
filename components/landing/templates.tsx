const TEMPLATES = [
  {
    name: "Minimal Pro",
    tag: "Más popular",
    accent: "bg-zinc-900",
    preview: "Minimal",
  },
  {
    name: "Executive",
    tag: "Corporativo",
    accent: "bg-blue-600",
    preview: "Executive",
  },
  {
    name: "Creative Flow",
    tag: "Diseño",
    accent: "bg-violet-600",
    preview: "Creative",
  },
];

export function Templates() {
  return (
    <section id="plantillas" className="bg-white py-20 dark:bg-zinc-950 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-widest text-zinc-500">PLANTILLAS</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-[36px]">Plantillas que enamoran a RRHH</h2>
            <p className="mt-3 max-w-lg text-[15px] leading-7 text-zinc-600 dark:text-zinc-400">
              Elige entre 12 diseños profesionales. Todos editables y optimizados para pasar los filtros ATS.
            </p>
          </div>
          <a href="#" className="text-sm font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-900 dark:text-white">
            Ver las 12 plantillas →
          </a>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TEMPLATES.map((t) => (
            <div key={t.name} className="group rounded-2xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="relative overflow-hidden rounded-xl border border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                {/* fake CV preview */}
                <div className="p-5">
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
                    <div className="h-16 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800" />
                    <div className="h-16 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800" />
                    <div className="h-16 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800" />
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 opacity-0 backdrop-blur-sm transition group-hover:opacity-100 dark:bg-zinc-900/80">
                  <span className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-zinc-900">
                    Usar plantilla
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between px-1 pb-1 pt-3">
                <div>
                  <h3 className="text-sm font-semibold">{t.name}</h3>
                  <p className="text-xs text-zinc-500">{t.preview} • A4 & Carta</p>
                </div>
                <span className="rounded-full border border-zinc-200 px-2.5 py-1 text-xs font-medium dark:border-zinc-700">{t.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
