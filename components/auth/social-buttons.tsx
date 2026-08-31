export function SocialButtons() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white text-sm font-medium transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M14.5 8.2c0-.55-.05-1.08-.14-1.6H8v3.03h3.65a3.13 3.13 0 01-1.36 2.05v1.7h2.2c1.29-1.19 2.03-2.94 2.03-5.18z"
            fill="#4285F4"
          />
          <path d="M8 14.5c1.85 0 3.4-0.61 4.53-1.67l-2.2-1.7A4.38 4.38 0 018 12.3a4.27 4.27 0 01-4.05-2.96H1.67v1.76A6.5 6.5 0 008 14.5z" fill="#34A853" />
          <path d="M3.95 9.34A4.27 4.27 0 013.72 8c0-.46.08-.92.23-1.34V4.9H1.67A6.5 6.5 0 001 8c0 1.05.25 2.04.67 2.9l2.28-1.56z" fill="#FBBC05" />
          <path d="M8 3.7c1 0 1.9.35 2.61.93l1.96-1.96A6.46 6.46 0 008 1.5a6.5 6.5 0 00-5.83 3.62l2.28 1.76A4.27 4.27 0 018 3.7z" fill="#EA4335" />
        </svg>
        Google
      </button>
      <button
        type="button"
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white text-sm font-medium transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
        </svg>
        GitHub
      </button>
    </div>
  );
}

export function Divider({ text = "o continúa con email" }: { text?: string }) {
  return (
    <div className="relative flex items-center py-2">
      <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
      <span className="px-3 text-xs text-zinc-500">{text}</span>
      <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
    </div>
  );
}
