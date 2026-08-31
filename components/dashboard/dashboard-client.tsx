"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { CvData, CvLang, CvRecord, CvTemplate } from "@/lib/cv/types";
import { CvList } from "./cv-list";
import { CvInlineEditor } from "./cv-inline-editor";
import { CvPreview } from "./cv-preview";
import { AtsPanel } from "@/components/ats/ats-panel";

export function DashboardClient({ initialCvs }: { initialCvs: CvRecord[]; userName: string }) {
  const [cvs, setCvs] = useState<CvRecord[]>(initialCvs);
  const [selectedId, setSelectedId] = useState<string | null>(initialCvs[0]?.id ?? null);
  const [saving, setSaving] = useState(false);
  const [showAts, setShowAts] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [atsWidth, setAtsWidth] = useState(380);
  const isResizing = useRef(false);

  useEffect(() => {
    setCvs(initialCvs);
    if (initialCvs.length > 0 && !initialCvs.find((c) => c.id === selectedId)) {
      setSelectedId(initialCvs[0].id);
    }
    if (initialCvs.length === 0) setSelectedId(null);
  }, [initialCvs]);

  const selected = useMemo(() => cvs.find((c) => c.id === selectedId) || null, [cvs, selectedId]);

  const [draft, setDraft] = useState<{ title: string; template: CvTemplate; lang: CvLang; data: CvData } | null>(
    selected ? { title: selected.title, template: selected.template, lang: selected.lang ?? "es", data: selected.data } : null
  );

  useEffect(() => {
    if (selected) setDraft({ title: selected.title, template: selected.template, lang: selected.lang ?? "es", data: selected.data });
    else setDraft(null);
  }, [selected?.id]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      const newWidth = window.innerWidth - e.clientX;
      setAtsWidth(Math.min(560, Math.max(280, newWidth)));
    };
    const onUp = () => {
      isResizing.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", (e) => onMove(e.touches[0] as unknown as MouseEvent));
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  useEffect(() => {
    if (!selected || !draft) return;
    const hasChanged =
      draft.title !== selected.title || draft.template !== selected.template || draft.lang !== (selected.lang ?? "es") || JSON.stringify(draft.data) !== JSON.stringify(selected.data);
    if (!hasChanged) return;
    const t = setTimeout(async () => {
      setSaving(true);
      const res = await fetch(`/api/cvs/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (res.ok) {
        const { cv } = await res.json();
        setCvs((prev) => prev.map((c) => (c.id === cv.id ? { ...c, ...cv, updatedAt: cv.updatedAt } : c)));
      }
      setSaving(false);
    }, 700);
    return () => clearTimeout(t);
  }, [draft, selected]);

  const handleDelete = useCallback(async (id: string) => {
    await fetch(`/api/cvs/${id}`, { method: "DELETE" });
    setCvs((p) => p.filter((c) => c.id !== id));
    if (selectedId === id) {
      const remaining = cvs.filter((c) => c.id !== id);
      setSelectedId(remaining[0]?.id ?? null);
    }
  }, [selectedId, cvs]);

  const handleDuplicate = async () => {
    if (!selected || !draft) return;
    const res = await fetch("/api/cvs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: `${draft.title} (copia)`, template: draft.template, lang: draft.lang, data: draft.data }),
    });
    if (res.ok) {
      const { cv } = await res.json();
      setCvs((p) => [cv, ...p]);
      setSelectedId(cv.id);
    }
  };

  if (cvs.length === 0) {
    return (
      <div className="flex flex-1">
        <div className="w-[200px] shrink-0 border-r border-zinc-200 dark:border-zinc-800">
          <CvList cvs={cvs} selectedId={selectedId} onSelect={setSelectedId} onDelete={handleDelete} />
        </div>
        <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 p-8 text-center dark:bg-zinc-950">
          <div className="max-w-md rounded-3xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">✦</div>
            <h2 className="mt-4 text-lg font-semibold">Bienvenido, crea tu primer CV</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">Elige una plantilla base y empieza a editar directamente sobre el papel. Guardado automático.</p>
            <Link href="/dashboard/new" className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900">
              Elegir plantilla →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left list */}
      <div className={`${collapsed ? "hidden w-0" : "hidden w-[200px]"} shrink-0 border-r border-zinc-200 dark:border-zinc-800 lg:flex lg:flex-col`}>
        <CvList cvs={cvs} selectedId={selectedId} onSelect={setSelectedId} onDelete={handleDelete} />
      </div>
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="hidden h-full w-5 shrink-0 items-center justify-center border-r border-zinc-200 bg-zinc-50 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900 lg:flex"
        title={collapsed ? "Mostrar lista" : "Ocultar lista"}
      >
        <span className="text-xs">{collapsed ? "›" : "‹"}</span>
      </button>

      {/* Mobile */}
      <div className="flex flex-1 flex-col lg:hidden">
        <div className="border-b border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900">
          <select value={selectedId ?? ""} onChange={(e) => setSelectedId(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900">
            {cvs.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>
        {draft && selected ? (
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex gap-1">
                <button onClick={() => setShowAts(false)} className={`rounded-full px-2.5 py-1 text-xs font-medium ${!showAts ? "bg-zinc-900 text-white" : "bg-zinc-100 dark:bg-zinc-800"}`}>Editar</button>
                <button onClick={() => setShowAts(true)} className={`rounded-full px-2.5 py-1 text-xs font-medium ${showAts ? "bg-violet-600 text-white" : "bg-zinc-100 dark:bg-zinc-800"}`}>ATS</button>
              </div>
              <span className="text-xs text-zinc-500">{saving ? "Guardando..." : "Guardado"}</span>
            </div>
            <div className="flex-1 overflow-auto bg-zinc-100 dark:bg-zinc-950">
              {showAts ? (
                <div className="p-4"><AtsPanel data={draft.data} onApply={(d) => setDraft((p) => (p ? { ...p, data: d } : p))} /></div>
              ) : (
                <div className="p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <input value={draft.title} onChange={(e) => setDraft((p) => (p ? { ...p, title: e.target.value } : p))} className="flex-1 rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-900" placeholder="Título" />
                    <select value={draft.template} onChange={(e) => setDraft((p) => (p ? { ...p, template: e.target.value as CvTemplate } : p))} className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-900">
                      <option value="minimal">Minimal</option>
                      <option value="executive">Executive</option>
                      <option value="creative">Creative</option>
                    </select>
                    <select value={draft.lang} onChange={(e) => setDraft((p) => (p ? { ...p, lang: e.target.value as CvLang } : p))} className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-900">
                      <option value="es">ES</option>
                      <option value="en">EN</option>
                    </select>
                  </div>
                  <div className="mx-auto w-full max-w-[210mm] min-h-[297mm] bg-white shadow dark:bg-zinc-900 print:shadow-none">
                    <CvInlineEditor data={draft.data} template={draft.template} lang={draft.lang} onChange={(d) => setDraft((p) => (p ? { ...p, data: d } : p))} />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* Desktop - inline paper + floating ATS panel */}
      {draft && selected ? (
        <div className="hidden flex-1 flex-col overflow-hidden lg:flex">
          {/* Toolbar */}
          <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-2">
              <input
                value={draft.title}
                onChange={(e) => setDraft((p) => (p ? { ...p, title: e.target.value } : p))}
                className="w-36 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium dark:border-zinc-700 dark:bg-zinc-800"
                placeholder="Título"
              />
              <select
                value={draft.template}
                onChange={(e) => setDraft((p) => (p ? { ...p, template: e.target.value as CvTemplate } : p))}
                className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-800"
              >
                <option value="minimal">Minimal</option>
                <option value="executive">Executive</option>
                <option value="creative">Creative</option>
              </select>
              <select
                value={draft.lang}
                onChange={(e) => setDraft((p) => (p ? { ...p, lang: e.target.value as CvLang } : p))}
                className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs font-medium dark:border-zinc-700 dark:bg-zinc-800"
                title="Idioma de la plantilla"
              >
                <option value="es">ES</option>
                <option value="en">EN</option>
              </select>
              <span className="hidden text-xs text-zinc-400 sm:inline">{saving ? "Guardando..." : "✓ Guardado"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowAts((v) => !v)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${showAts ? "bg-violet-600 text-white" : "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"}`}
              >
                {showAts ? "✕ Cerrar ATS" : "◈ Analizar ATS"}
              </button>
              <span className="mx-1 h-4 w-px bg-zinc-200 dark:bg-zinc-700" />
              <button onClick={handleDuplicate} className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900">Duplicar</button>
              <button onClick={() => window.print()} className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-white dark:bg-white dark:text-zinc-900">PDF</button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Center paper - A4 - web y print idénticos */}
            <div className="flex flex-1 flex-col overflow-auto bg-zinc-100 p-4 dark:bg-zinc-950 sm:p-6">
              <div className="mx-auto w-full max-w-[210mm] min-h-[297mm] bg-white shadow-[0_16px_40px_rgba(0,0,0,0.08)] dark:bg-zinc-900 print:shadow-none">
                <CvInlineEditor data={draft.data} template={draft.template} lang={draft.lang} onChange={(d) => setDraft((p) => (p ? { ...p, data: d } : p))} />
              </div>
            </div>

            {/* Floating right ATS panel - resizable */}
            {showAts && (
              <div className="relative flex shrink-0 flex-col border-l border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900" style={{ width: atsWidth }}>
                <div
                  onMouseDown={() => {
                    isResizing.current = true;
                    document.body.style.cursor = "col-resize";
                    document.body.style.userSelect = "none";
                  }}
                  onTouchStart={() => {
                    isResizing.current = true;
                  }}
                  className="absolute left-0 top-0 z-10 h-full w-1.5 cursor-col-resize hover:bg-violet-200 dark:hover:bg-violet-900/50"
                  title="Arrastra para redimensionar"
                />
                <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
                  <h3 className="text-xs font-bold uppercase tracking-widest">Analizar ATS</h3>
                  <button onClick={() => setShowAts(false)} className="rounded-full bg-zinc-100 px-2 py-1 text-xs hover:bg-zinc-200 dark:bg-zinc-800">
                    ✕
                  </button>
                </div>
                <div className="flex-1 overflow-auto p-4">
                  <AtsPanel data={draft.data} onApply={(d) => setDraft((p) => (p ? { ...p, data: d } : p))} />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
      {/* Print-only CV - visible only when printing */}
      {draft && (
        <div id="cv-print" className="hidden">
          <CvPreview data={draft.data} template={draft.template} lang={draft.lang} />
        </div>
      )}
    </div>
  );
}
