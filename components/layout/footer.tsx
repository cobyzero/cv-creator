import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-100 bg-white dark:border-zinc-900 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path
                    d="M3 5.5C3 4.672 3.672 4 4.5 4H6V12H4.5C3.672 12 3 11.328 3 10.5V5.5Z M10 4H11.5C12.328 4 13 4.672 13 5.5V10.5C13 11.328 12.328 12 11.5 12H10V4Z M7 4H9V12H7V4Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <span className="text-sm font-semibold tracking-tight">cvcraft</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Crea un CV profesional en minutos. Plantillas diseñadas por expertos en RRHH y optimizadas para ATS.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Producto</h4>
            <ul className="mt-4 space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
              <li><Link href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100">Plantillas</Link></li>
              <li><Link href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100">Ejemplos</Link></li>
              <li><Link href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100">Guías</Link></li>
              <li><Link href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100">Precios</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Recursos</h4>
            <ul className="mt-4 space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
              <li><Link href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100">Blog</Link></li>
              <li><Link href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100">Centro de ayuda</Link></li>
              <li><Link href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100">Consejos CV</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="mt-4 space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
              <li><Link href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100">Privacidad</Link></li>
              <li><Link href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100">Términos</Link></li>
              <li><Link href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100">Contacto</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-100 pt-8 text-sm text-zinc-500 dark:border-zinc-900 dark:text-zinc-500 md:flex-row">
          <p>© {new Date().getFullYear()} cvcraft. Todos los derechos reservados.</p>
          <p className="text-xs">Hecho con ♥ para conseguir tu próximo trabajo</p>
        </div>
      </div>
    </footer>
  );
}
