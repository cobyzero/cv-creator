import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyze, importPdf, saveCv } from "../lib/api";

type Status = { tone: "info" | "ok" | "error"; text: string } | null;

export function Import() {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState<"idle" | "extract" | "analyze">("idle");
  const [status, setStatus] = useState<Status>(null);
  const nav = useNavigate();

  async function onFile(f: File | undefined) {
    if (!f) return;
    setFileName(f.name);
    setBusy("extract");
    setStatus({ tone: "info", text: "Extrayendo texto del PDF…" });
    try {
      const r = await importPdf(f);
      if (r.scanned) {
        setStatus({ tone: "error", text: "El PDF parece escaneado: revisa o completa el texto a mano." });
        setText(r.raw_text || "");
      } else {
        setText(r.raw_text);
        setStatus({ tone: "ok", text: `${r.raw_text.length} caracteres listos. Pulsa Componer.` });
      }
    } catch (e: any) {
      setStatus({ tone: "error", text: "No se pudo leer el PDF: " + String(e.message || e) });
    } finally {
      setBusy("idle");
    }
  }

  async function onAnalyze() {
    if (text.trim().length < 20) {
      setStatus({ tone: "error", text: "Pega al menos unas líneas o sube un PDF." });
      return;
    }
    setBusy("analyze");
    setStatus({ tone: "info", text: "Componiendo con DeepSeek…" });
    try {
      const r = await analyze(text, fileName);
      const s = await saveCv(r.cv_json.personal?.nombre || "Sin título", r.cv_json);
      nav(`/editor/${s.id}`, { state: r.cv_json });
    } catch (e: any) {
      setStatus({ tone: "error", text: "Falló DeepSeek (revisa backend/.env y conexión): " + String(e.message || e).slice(0, 300) });
    } finally {
      setBusy("idle");
    }
  }

  return (
    <main className="workspace">
      <h1 className="lede"><span className="kicker">N.º 01 — Importar</span>Del texto bruto<br />al pliego.</h1>
      <div className="import-grid">
        <div className="folio-grid">
          <span className="folio" aria-hidden="true">§1</span>
          <section className="panel" aria-label="Fuente">
            <span className="label">Fuente — PDF o texto</span>
            <label
              className="drop"
              data-over={dragOver}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); onFile(e.dataTransfer.files?.[0]); }}
            >
              {fileName ? `◼ ${fileName}` : "Arrastra un PDF aquí o pulsa para elegirlo"}
              <input type="file" accept="application/pdf" onChange={(e) => onFile(e.target.files?.[0])} />
            </label>
            <label className="f-label" htmlFor="src-text">Texto</label>
            <textarea
              id="src-text" className="field" rows={14}
              value={text} onChange={(e) => setText(e.target.value)}
              placeholder="…o pega aquí el texto del CV"
            />
            <div style={{ marginTop: "var(--space-s)", display: "flex", gap: "var(--space-s)", alignItems: "center", flexWrap: "wrap" }}>
              <button className="btn btn-accent" onClick={onAnalyze} disabled={busy !== "idle"} aria-busy={busy === "analyze"}>
                {busy === "analyze" ? "Componiendo…" : "Componer CV"}
              </button>
              <span className="status-line" role="status">{busy === "extract" ? "Extrayendo…" : `${text.trim().length} caracteres`}</span>
            </div>
            {status && <div className="banner" data-tone={status.tone === "error" ? undefined : status.tone}>{status.text}</div>}
            {busy === "analyze" && (
              <div className="skeleton" aria-hidden="true"><i style={{ width: "60%" }} /><i style={{ width: "90%" }} /><i style={{ width: "75%" }} /></div>
            )}
          </section>
        </div>
        <div className="folio-grid">
          <span className="folio" aria-hidden="true">§2</span>
          <aside className="panel" aria-label="Cómo funciona">
            <span className="label">Cómo funciona</span>
            <ol className="steps">
              <li><span className="n">1</span>El PDF se convierte a texto en tu máquina, sin IA.</li>
              <li><span className="n">2</span>Solo el texto viaja a DeepSeek y vuelve como ficha.</li>
              <li><span className="n">3</span>La ficha se monta en el template Minimal ATS.</li>
              <li><span className="n">4</span>Todo queda en SQLite local. Nada más sale.</li>
            </ol>
          </aside>
        </div>
      </div>
    </main>
  );
}
