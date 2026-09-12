import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { API, saveCv, tailor, updateCv } from "../lib/api";
import { exportCvPdf } from "../lib/cvToPdf";
import { emptyCv, type CvJson } from "../lib/types";
import { MinimalAts } from "../templates/MinimalAts";

type Analisis = { debilidad: string; cambios: string[] };

export function Editor() {
  const { id } = useParams();
  const loc = useLocation() as any;
  const nav = useNavigate();
  const initial = loc.state?.personal ? loc.state as CvJson : (loc.state?.cv as CvJson) || emptyCv;
  const [cv, setCv] = useState<CvJson>(initial);
  const [title, setTitle] = useState("CV");
  const [msg, setMsg] = useState("");
  const [missing, setMissing] = useState(false);
  const analisis = (loc.state?.analisis as Analisis) || null;
  const [vacante, setVacante] = useState("");
  const [tailorBusy, setTailorBusy] = useState(false);
  const [tailorErr, setTailorErr] = useState("");

  useEffect(() => {
    if (!loc.state && id) {
      fetch(`${API}/api/cvs`).then((r) => r.json()).then((all: any[]) => {
        const f = all.find((x) => x.id === id);
        if (f) { setCv(JSON.parse(f.data)); setTitle(f.title); }
        else setMissing(true);
      });
    }
  }, []);

  useEffect(() => {
    if (!id) return;
    const t = setTimeout(() => {
      updateCv(id!, title, cv).then(() => setMsg("Guardado " + new Date().toLocaleTimeString()));
    }, 800);
    return () => clearTimeout(t);
  }, [cv, title]);

  async function onTailor() {
    if (vacante.trim().length < 30) { setTailorErr("Pega la descripción completa de la vacante."); return; }
    setTailorBusy(true);
    setTailorErr("");
    try {
      const r = await tailor(cv, vacante);
      const s = await saveCv(`${title} · adaptado`, r.cv_json);
      nav(`/editor/${s.id}`, { state: { cv: r.cv_json, analisis: { debilidad: r.debilidad, cambios: r.cambios } } });
    } catch (e: any) {
      setTailorErr("Falló la adaptación: " + String(e.message || e).slice(0, 300));
    } finally {
      setTailorBusy(false);
    }
  }

  if (missing) {
    return (
      <main className="workspace">
        <div className="empty">Ese pliego no existe.<br /><a href="/cvs">Volver al archivo</a></div>
      </main>
    );
  }

  return (
    <main className="workspace">
      <h1 className="lede"><span className="kicker">N.º 02 — Mesa</span>Componer<br />el pliego.</h1>
      {analisis && (
        <div className="banner" data-tone="info" style={{ marginBottom: "var(--space-m)" }}>
          <strong>Punto débil para este puesto:</strong> {analisis.debilidad || "—"}
          {analisis.cambios.length > 0 && (
            <ul style={{ margin: "var(--space-2xs) 0 0", paddingLeft: "var(--space-m)" }}>
              {analisis.cambios.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          )}
        </div>
      )}
      <div className="bench">
        <section className="bench-side no-print" aria-label="Editor">
          <div className="toolbar">
            <button className="btn btn-accent" onClick={() => exportCvPdf(cv, title)}>Exportar PDF</button>
            <button className="btn btn-ghost" onClick={() => window.print()}>Imprimir</button>
            <span className="status-line" role="status">{msg || "Edita y se guarda solo"}</span>
          </div>
          <label className="f-label" htmlFor="ed-title">Título interno</label>
          <input id="ed-title" className="field" value={title} onChange={(e) => setTitle(e.target.value)} />
          <label className="f-label" htmlFor="ed-nombre">Nombre</label>
          <input id="ed-nombre" className="field" value={cv.personal.nombre} onChange={(e) => setCv({ ...cv, personal: { ...cv.personal, nombre: e.target.value } })} />
          <label className="f-label" htmlFor="ed-email">Email</label>
          <input id="ed-email" className="field" value={cv.personal.email || ""} onChange={(e) => setCv({ ...cv, personal: { ...cv.personal, email: e.target.value } })} />
          <label className="f-label" htmlFor="ed-resumen">Resumen</label>
          <textarea id="ed-resumen" className="field" rows={4} value={cv.resumen} onChange={(e) => setCv({ ...cv, resumen: e.target.value })} />
          <label className="f-label" htmlFor="ed-skills">Skills (coma-separadas)</label>
          <textarea
            id="ed-skills" className="field" rows={2} value={cv.skills.join(", ")}
            onChange={(e) => setCv({ ...cv, skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
          />
          <div className="panel" style={{ marginTop: "var(--space-xl)" }}>
            <span className="label">Sastre — adaptar a una vacante</span>
            <label className="f-label" htmlFor="ed-vacante">Pega la vacante</label>
            <textarea
              id="ed-vacante" className="field" rows={8} value={vacante}
              onChange={(e) => setVacante(e.target.value)}
              placeholder="Pega aquí la descripción del puesto…"
            />
            <div style={{ marginTop: "var(--space-s)" }}>
              <button className="btn" onClick={onTailor} disabled={tailorBusy} aria-busy={tailorBusy}>
                {tailorBusy ? "Sastreando…" : "Adaptar a esta vacante"}
              </button>
            </div>
            {tailorErr && <div className="banner">{tailorErr}</div>}
            <p className="status-line">Crea una copia adaptada; tu original queda intacto.</p>
          </div>
        </section>
        <section className="bench-paper" aria-label="Vista previa">
          <MinimalAts data={cv} />
        </section>
      </div>
    </main>
  );
}
