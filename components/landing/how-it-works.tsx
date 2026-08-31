const STEPS = [
  { n: "01", title: "Elige plantilla", desc: "12 diseños profesionales listos para personalizar en un clic." },
  { n: "02", title: "Completa tu info", desc: "Guía paso a paso con ejemplos y sugerencias de IA." },
  { n: "03", title: "Descarga y aplica", desc: "Exporta en PDF perfecto y empieza a conseguir entrevistas." },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-zinc-900 py-20 text-white dark:bg-black md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold tracking-widest text-zinc-400">CÓMO FUNCIONA</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-[36px] md:leading-tight">
              De cero a CV listo en
              <br /> <span className="text-zinc-400">3 simples pasos</span>
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-7 text-zinc-400">
              Sin registrarte si no quieres. Sin curva de aprendizaje. Solo resultados.
            </p>
            <div className="mt-8 space-y-6">
              {STEPS.map((s) => (
                <div key={s.n} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-xs font-semibold">
                    {s.n}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold">{s.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-zinc-400">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative rounded-2xl border border-zinc-800 bg-zinc-800/50 p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-widest text-zinc-400">Progreso</span>
              <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-semibold text-white">85% completo</span>
            </div>
            <div className="mt-4 h-2 w-full rounded-full bg-zinc-700">
              <div className="h-2 w-[85%] rounded-full bg-white" />
            </div>
            <div className="mt-6 space-y-3">
              {[
                { label: "Información personal", done: true },
                { label: "Experiencia laboral", done: true },
                { label: "Educación", done: true },
                { label: "Habilidades", done: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3">
                  <span className="text-sm">{item.label}</span>
                  {item.done ? (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                  ) : (
                    <span className="h-6 w-6 rounded-full border border-zinc-600" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
