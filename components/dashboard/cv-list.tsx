"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CvRecord } from "@/lib/cv/types";

function timeAgo(date: string) {
  const d = new Date(date);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
}

export function CvList({
  cvs,
  selectedId,
  onSelect,
  onDelete,
}: {
  cvs: CvRecord[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/cvs/import", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al importar");
      router.refresh();
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "Error");
    } finally {
      setImporting(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex h-full flex-col bg-white dark:bg-zinc-900">
      <div className="px-3 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Mis CVs</h2>
          <span className="rounded-full bg-zinc-100 px-1.5 py-0.5 text-[11px] font-medium dark:bg-zinc-800">{cvs.length}</span>
        </div>
        <Link
          href="/dashboard/new"
          className="mt-2.5 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
        >
          <span className="text-sm leading-none">+</span> Nuevo
        </Link>
        <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="hidden" onChange={handleFile} />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={importing}
          className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
        >
          {importing ? "Importando..." : "↥ Importar PDF"}
        </button>
        {importError && <p className="mt-2 rounded-lg bg-red-50 px-2 py-1 text-xs text-red-600 dark:bg-red-950/30 dark:text-red-300">{importError}</p>}
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-3">
        {cvs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-200 px-3 py-4 text-center dark:border-zinc-700">
            <p className="text-xs font-medium">Sin CVs</p>
            <p className="mt-1 text-[11px] leading-4 text-zinc-500">Crea uno y aparecerá aquí.</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {cvs.map((cv) => (
              <div
                key={cv.id}
                onClick={() => onSelect(cv.id)}
                className={`group relative flex cursor-pointer items-center gap-2 rounded-xl border px-2 py-1.5 text-left transition ${
                  selectedId === cv.id
                    ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900"
                    : "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                }`}
              >
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold ${
                    selectedId === cv.id ? "bg-white/20 text-white dark:bg-zinc-900 dark:text-white" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                  }`}
                >
                  {cv.title.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium leading-none">{cv.title}</p>
                  <p className={`mt-0.5 flex items-center gap-1 text-[10px] ${selectedId === cv.id ? "text-white/60 dark:text-zinc-500" : "text-zinc-500"}`}>
                    <span className={`rounded px-1 py-0 ${selectedId === cv.id ? "bg-white/15" : "bg-zinc-100 dark:bg-zinc-800"}`}>{cv.template}</span>
                    <span>· {timeAgo(cv.updatedAt)}</span>
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm("¿Eliminar este CV?")) onDelete(cv.id);
                  }}
                  className={`shrink-0 rounded-full p-1 text-[11px] opacity-0 transition group-hover:opacity-100 ${selectedId === cv.id ? "hover:bg-white/20" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}
                  title="Eliminar"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-zinc-100 px-3 py-2 text-[11px] text-zinc-400 dark:border-zinc-800">
        Guardado automático ✓
      </div>
    </div>
  );
}
