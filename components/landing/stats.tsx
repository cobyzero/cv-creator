export function Stats() {
  return (
    <section className="border-y border-zinc-100 bg-white dark:border-zinc-900 dark:bg-zinc-950">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-8 md:grid-cols-4">
        {[
          { value: "12k+", label: "CV creados" },
          { value: "4.9/5", label: "Valoración media" },
          { value: "98%", label: "Compatibilidad ATS" },
          { value: "3 min", label: "Tiempo promedio" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-2xl font-semibold tracking-tight">{s.value}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-widest text-zinc-500">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
