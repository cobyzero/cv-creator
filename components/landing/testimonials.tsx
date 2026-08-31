const TESTIMONIALS = [
  {
    name: "Ana García",
    role: "Diseñadora UX • Conseguí trabajo en 2 semanas",
    text: "Probé 5 creadores y este es el único que no me hizo perder el tiempo. El resultado parece hecho por un diseñador.",
    avatar: "https://i.pravatar.cc/100?img=5",
  },
  {
    name: "Carlos Ruiz",
    role: "Desarrollador Full Stack",
    text: "La puntuación ATS me ayudó a entender qué cambiar. Pasé de 0 respuestas a 4 entrevistas en una semana.",
    avatar: "https://i.pravatar.cc/100?img=12",
  },
  {
    name: "Laura Méndez",
    role: "Marketing Manager",
    text: "Soy malísima diseñando. Con cvcraft mi CV quedó elegante y profesional sin tocar una línea de código.",
    avatar: "https://i.pravatar.cc/100?img=9",
  },
];

export function Testimonials() {
  return (
    <section className="bg-zinc-50 py-20 dark:bg-zinc-900/50 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-[32px]">Miles ya consiguieron su empleo soñado</h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex gap-1 text-amber-500">★★★★★</div>
              <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">&quot;{t.text}&quot;</p>
              <div className="mt-6 flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="h-9 w-9 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
