import Link from "next/link";

export function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left - Form */}
      <div className="flex w-full flex-col lg:w-[52%] xl:w-[48%]">
        {/* mini header */}
        <div className="flex h-16 items-center px-6 sm:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M3 5.5C3 4.672 3.672 4 4.5 4H6V12H4.5C3.672 12 3 11.328 3 10.5V5.5Z M10 4H11.5C12.328 4 13 4.672 13 5.5V10.5C13 11.328 12.328 12 11.5 12H10V4Z M7 4H9V12H7V4Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className="text-[15px] font-semibold tracking-tight">cvcraft</span>
          </Link>
          <Link href="/" className="ml-auto hidden text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white sm:inline">
            ← Volver al inicio
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-8">
          <div className="w-full max-w-[400px]">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>

        <p className="px-6 py-6 text-center text-xs text-zinc-500 sm:px-8">
          Al continuar aceptas nuestros{" "}
          <Link href="#" className="underline underline-offset-4 hover:text-zinc-900 dark:hover:text-white">
            Términos
          </Link>{" "}
          y{" "}
          <Link href="#" className="underline underline-offset-4 hover:text-zinc-900 dark:hover:text-white">
            Privacidad
          </Link>
          .
        </p>
      </div>

      {/* Right - Visual */}
      <div className="hidden flex-1 bg-zinc-900 dark:bg-black lg:flex">
        <div className="relative flex w-full flex-col justify-between overflow-hidden p-10">
          {/* gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-zinc-900 to-zinc-900" />
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              +12.483 profesionales ya crearon su CV
            </div>
          </div>

          <div className="relative">
            {/* testimonial card */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="flex gap-1 text-amber-400">★★★★★</div>
              <p className="mt-3 text-sm leading-6 text-white/90">
                &quot;Conseguí 3 entrevistas en una semana. La plantilla Executive es perfecta y el editor es súper rápido.&quot;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <img src="https://i.pravatar.cc/100?img=33" alt="" className="h-8 w-8 rounded-full" />
                <div>
                  <p className="text-sm font-medium text-white">Marina López</p>
                  <p className="text-xs text-white/60">Product Designer en Cabify</p>
                </div>
              </div>
            </div>

            {/* mini CV preview */}
            <div className="absolute -top-24 right-0 hidden w-56 rotate-3 rounded-xl border border-white/10 bg-white p-4 shadow-2xl xl:block">
              <div className="h-1.5 w-full rounded bg-zinc-900" />
              <div className="mt-3 flex gap-2">
                <div className="h-8 w-8 rounded-lg bg-zinc-100" />
                <div className="space-y-1">
                  <div className="h-2 w-16 rounded bg-zinc-900" />
                  <div className="h-1.5 w-24 rounded bg-zinc-200" />
                </div>
              </div>
              <div className="mt-3 space-y-1.5">
                <div className="h-1 w-full rounded bg-zinc-100" />
                <div className="h-1 w-5/6 rounded bg-zinc-100" />
                <div className="h-1 w-4/6 rounded bg-zinc-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
