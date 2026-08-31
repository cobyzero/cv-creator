import Link from "next/link";

export function CTA() {
  return (
    <section className="bg-white py-16 dark:bg-zinc-950 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-[28px] bg-zinc-900 px-6 py-12 text-center dark:bg-white md:px-12 md:py-16">
          {/* decor */}
          <div className="absolute -top-24 left-1/2 h-72 w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600/20 via-transparent to-amber-500/20 blur-2xl" />

          <h2 className="relative mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-white dark:text-zinc-900 md:text-[40px] md:leading-tight">
            ¿Listo para tu próximo trabajo?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-[15px] leading-7 text-zinc-400 dark:text-zinc-600">
            Únete a más de 12.000 profesionales que ya crearon su CV con cvcraft. Gratis, rápido y sin complicaciones.
          </p>

          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-white px-8 text-base font-medium text-zinc-900 transition hover:bg-zinc-100 dark:bg-zinc-900 dark:text-white sm:w-auto"
            >
              Crear mi CV ahora — es gratis
            </Link>
            <span className="text-xs text-zinc-500 dark:text-zinc-500">No se requiere tarjeta • Cancela cuando quieras</span>
          </div>

          <p className="relative mt-6 text-xs text-zinc-500">✓ Plantillas ATS • ✓ Exportación PDF ilimitada • ✓ Soporte en español</p>
        </div>
      </div>
    </section>
  );
}
