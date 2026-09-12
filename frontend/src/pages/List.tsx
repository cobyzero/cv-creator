import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listCvs } from "../lib/api";

export function List() {
  const [cvs, setCvs] = useState<any[]>([]);
  useEffect(() => { listCvs().then(setCvs).catch(() => setCvs([])); }, []);

  function exportJson(c: any) {
    const blob = new Blob([c.data], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${c.title}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <main className="workspace">
      <h1 className="lede"><span className="kicker">N.º 03 — Archivo</span>Mis<br />pliegos.</h1>
      {cvs.length === 0 ? (
        <div className="empty">Archivo vacío.<br /><Link to="/">Importa el primero →</Link></div>
      ) : (
        <table className="ledger">
          <thead><tr><th>N.º</th><th>Título</th><th>Plantilla</th><th>Actualizado</th><th></th></tr></thead>
          <tbody>
            {cvs.map((c, i) => (
              <tr key={c.id}>
                <td className="num">{String(i + 1).padStart(2, "0")}</td>
                <td><Link to={`/editor/${c.id}`}>{c.title}</Link></td>
                <td className="num">{c.template}</td>
                <td className="num">{new Date(c.updated_at).toLocaleDateString()}</td>
                <td><button className="btn btn-ghost" onClick={() => exportJson(c)}>JSON</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
