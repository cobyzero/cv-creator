const FEATURES = [
  {
    title: "Editor visual intuitivo",
    desc: "Arrastra, edita y previsualiza en tiempo real. Sin fricción, sin plantillas rotas.",
    icon: "◈",
  },
  {
    title: "Plantillas premium",
    desc: "Diseñadas por reclutadores. Limpias, modernas y 100% compatibles con ATS.",
    icon: "⬢",
  },
  {
    title: "Exportación perfecta",
    desc: "PDF de alta calidad, listo para imprimir y para enviar a cualquier empresa.",
    icon: "⬣",
  },
  {
    title: "IA que te ayuda",
    desc: "Sugerencias inteligentes para descripciones, logros y palabras clave.",
    icon: "✦",
  },
  {
    title: "Multiformato",
    desc: "CV, carta de presentación y portfolio vinculados. Todo coherente.",
    icon: "◎",
  },
  {
    title: "Privacidad total",
    desc: "Tus datos son tuyos. Sin venta de información, exportación cuando quieras.",
    icon: "⬔",
  },
];

export function Features() {
  return (
    <section id="funciones" className="bg-zinc-50 py-20 dark:bg-zinc-900/50 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-widest text-zinc-500">FUNCIONES</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white md:text-[36px] md:leading-tight">
            Todo lo que necesitas para
            <br /> conseguir entrevistas
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-zinc-600 dark:text-zinc-400">
            No es solo un editor. Es tu ventaja competitiva para destacar en el mercado laboral.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-zinc-200 bg-white p-6 transition hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-sm text-white dark:bg-white dark:text-zinc-900">
                {f.icon}
              </div>
              <h3 className="mt-4 text-[15px] font-semibold text-zinc-900 dark:text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
