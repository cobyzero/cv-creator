import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { API, updateCv } from "../lib/api";
import { emptyCv, type CvJson } from "../lib/types";
import { MinimalAts } from "../templates/MinimalAts";

export function Editor() {
  const { id } = useParams();
  const loc = useLocation() as any;
  const [cv, setCv] = useState<CvJson>(loc.state || emptyCv);
  const [title, setTitle] = useState("CV");
  const [msg, setMsg] = useState("");
  const [missing, setMissing] = useState(false);

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
      <div className="bench">
        <section className="bench-side no-print" aria-label="Editor">
          <div className="toolbar">
            <button className="btn" onClick={() => window.print()}>Imprimir / PDF</button>
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
        </section>
        <section className="bench-paper" aria-label="Vista previa">
          <MinimalAts data={cv} />
        </section>
      </div>
    </main>
  );
}
