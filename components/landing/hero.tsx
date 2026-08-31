import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-zinc-950">
      {/* subtle grid */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f4f4f5_1px,transparent_1px),linear-gradient(to_bottom,#f4f4f5_1px,transparent_1px)] bg-[size:48px_48px] opacity-60 dark:bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] dark:opacity-20" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-white dark:to-zinc-950" />

      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          {/* Left */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <Badge className="mb-6 gap-2 py-1.5">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              Nuevo: Plantillas ATS 2025
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-zinc-400">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Badge>

            <h1 className="max-w-xl text-4xl font-semibold leading-[0.95] tracking-tight text-zinc-900 dark:text-white md:text-[52px]">
              Tu CV profesional,
              <span className="bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-400 bg-clip-text text-transparent dark:from-white dark:via-zinc-200 dark:to-zinc-500">
                {" "}en minutos
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-[17px] leading-7 text-zinc-600 dark:text-zinc-400">
              Creador intuitivo, plantillas premium y exportación perfecta. Destaca entre cientos de candidatos sin pelearte con el diseño.
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/register"
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-zinc-900 px-8 text-base font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 sm:w-auto"
              >
                Crear mi CV gratis
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-2">
                  <path d="M3.5 8H12.5M12.5 8L8.5 4M12.5 8L8.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                href="#plantillas"
                className="inline-flex h-12 w-full items-center justify-center rounded-full border border-zinc-200 bg-white px-8 text-base font-medium transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 sm:w-auto"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mr-2">
                  <path d="M8 3.5v8M3.5 8l4.5 4.5L12.5 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 12.5V13.5H14V12.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                Ver plantillas
              </Link>
            </div>

            <div className="mt-6 flex items-center gap-4 text-sm">
              <div className="flex -space-x-2">
                <img src="https://i.pravatar.cc/100?img=32" alt="" className="h-7 w-7 rounded-full border-2 border-white object-cover" />
                <img src="https://i.pravatar.cc/100?img=14" alt="" className="h-7 w-7 rounded-full border-2 border-white object-cover" />
                <img src="https://i.pravatar.cc/100?img=16" alt="" className="h-7 w-7 rounded-full border-2 border-white object-cover" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-zinc-900 dark:text-white">4.9/5</span>
                  <span className="text-amber-500">★★★★★</span>
                </div>
                <p className="text-xs text-zinc-500">+12.483 usuarios felices</p>
              </div>
              <span className="hidden h-8 w-px bg-zinc-200 dark:bg-zinc-800 sm:block" />
              <p className="hidden text-xs text-zinc-500 sm:block">Sin tarjeta • En 3 minutos</p>
            </div>
          </div>

          {/* Right - CV Preview Mock */}
          <div className="relative mx-auto w-full max-w-[420px] lg:ml-auto">
            {/* glow */}
            <div className="absolute -inset-6 -z-10 rounded-[32px] bg-gradient-to-br from-violet-100 via-zinc-100 to-amber-50 opacity-60 blur-2xl dark:from-violet-950/30 dark:via-zinc-900 dark:to-amber-950/20" />

            <div className="relative rounded-[20px] border border-zinc-200 bg-white p-3 shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:border-zinc-800 dark:bg-zinc-900">
              {/* browser dots */}
              <div className="mb-3 flex items-center gap-1.5 px-1">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                <span className="ml-auto text-[11px] font-medium text-zinc-400">cvcraft.app/editor</span>
              </div>

              {/* CV paper */}
              <div className="rounded-xl border border-zinc-100 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                <div className="flex gap-5">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="h-14 w-14 shrink-0 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-700 dark:from-zinc-700 dark:to-zinc-900" />
                      <div>
                        <div className="h-3 w-24 rounded bg-zinc-900 dark:bg-white" />
                        <div className="mt-2 h-2 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
                        <div className="mt-1.5 flex gap-1.5">
                          <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[9px] font-medium text-white dark:bg-white dark:text-zinc-900">Producto</span>
                          <span className="rounded-full border border-zinc-200 px-2 py-0.5 text-[9px] dark:border-zinc-700 dark:text-zinc-300">Madrid</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      <div>
                        <div className="h-2 w-16 rounded bg-zinc-900 dark:bg-white" />
                        <div className="mt-2 space-y-1.5">
                          <div className="h-1.5 w-full rounded bg-zinc-100 dark:bg-zinc-800" />
                          <div className="h-1.5 w-5/6 rounded bg-zinc-100 dark:bg-zinc-800" />
                          <div className="h-1.5 w-4/6 rounded bg-zinc-100 dark:bg-zinc-800" />
                        </div>
                      </div>
                      <div>
                        <div className="h-2 w-20 rounded bg-zinc-900 dark:bg-white" />
                        <div className="mt-3 space-y-2.5">
                          {[1, 2].map((i) => (
                            <div key={i} className="flex gap-2">
                              <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900 dark:bg-white" />
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                  <div className="h-2 w-24 rounded bg-zinc-800 dark:bg-zinc-200" />
                                  <div className="h-1.5 w-12 rounded bg-zinc-200 dark:bg-zinc-700" />
                                </div>
                                <div className="h-1.5 w-full rounded bg-zinc-100 dark:bg-zinc-800" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-28 shrink-0 space-y-4 border-l border-zinc-100 pl-4 dark:border-zinc-800">
                    <div>
                      <div className="h-1.5 w-10 rounded bg-zinc-900 dark:bg-white" />
                      <div className="mt-2 space-y-1">
                        <div className="h-1 w-full rounded bg-zinc-100 dark:bg-zinc-800" />
                        <div className="h-1 w-5/6 rounded bg-zinc-100 dark:bg-zinc-800" />
                      </div>
                    </div>
                    <div>
                      <div className="h-1.5 w-12 rounded bg-zinc-900 dark:bg-white" />
                      <div className="mt-2 flex flex-wrap gap-1">
                        {["Figma", "React", "UX", "UI"].map((s) => (
                          <span key={s} className="rounded bg-zinc-900 px-1.5 py-0.5 text-[8px] font-medium text-white dark:bg-zinc-800">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="h-1.5 w-14 rounded bg-zinc-900 dark:bg-white" />
                      <div className="mt-2 space-y-1.5">
                        <div className="flex justify-between text-[8px]"><span>Español</span><span className="text-zinc-400">Nativo</span></div>
                        <div className="h-1 w-full rounded-full bg-zinc-100 dark:bg-zinc-800"><div className="h-1 w-[90%] rounded-full bg-zinc-900 dark:bg-white" /></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* floating badges */}
              <div className="absolute -left-4 top-20 hidden rounded-2xl border border-zinc-200 bg-white p-3 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 md:flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <div>
                  <p className="text-xs font-semibold">ATS Optimizado</p>
                  <p className="text-[11px] text-zinc-500">98% compatibilidad</p>
                </div>
              </div>

              <div className="absolute -right-3 bottom-10 hidden rounded-2xl border border-zinc-200 bg-white px-3 py-2 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 md:flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                <span className="text-xs font-medium">Exportando a PDF...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
