import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard");

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-900 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 5.5C3 4.672 3.672 4 4.5 4H6V12H4.5C3.672 12 3 11.328 3 10.5V5.5Z M10 4H11.5C12.328 4 13 4.672 13 5.5V10.5C13 11.328 12.328 12 11.5 12H10V4Z M7 4H9V12H7V4Z" fill="currentColor" />
              </svg>
            </div>
            <span className="text-sm font-semibold tracking-tight">cvcraft</span>
            <span className="hidden rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 sm:inline">Dashboard</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-zinc-600 dark:text-zinc-400 sm:inline">
            {session.user.name || session.user.email}
          </span>
          <img
            src={session.user.image || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(session.user.name || session.user.email || "U")}`}
            alt=""
            className="h-8 w-8 rounded-full border border-zinc-200 object-cover dark:border-zinc-700"
          />
          <Link href="/api/auth/signout" className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
            Salir
          </Link>
        </div>
      </header>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
