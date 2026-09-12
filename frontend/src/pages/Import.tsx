import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { importPdf, analyze, saveCv } from "../lib/api";
export function Import() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const nav = useNavigate();
  async function onFile(f: File | undefined) {
    if (!f) return; setStatus("Extrayendo texto…");
    try { const r = await importPdf(f);
      if (r.scanned) { setStatus("PDF parece escaneado, pega el texto manualmente."); setText(r.raw_text||""); }
      else { setText(r.raw_text); setStatus("Texto extraído, pulsa Analizar."); }
    } catch(e:any){ setStatus("Error: "+String(e.message||e)); }
  }
  async function onAnalyze() {
    if (text.length < 20) { setStatus("Pega más texto o sube un PDF."); return; }
    setStatus("Analizando con DeepSeek…");
    try { const r = await analyze(text); const s = await saveCv(r.cv_json.personal?.nombre||"Sin título", r.cv_json);
      nav(`/editor/${s.id}`, { state: r.cv_json }); }
    catch(e:any){ setStatus("Error DeepSeek (revisa backend/.env y conexión): "+String(e.message||e).slice(0,300)); }
  }
  return (<div style={{padding:24,maxWidth:720}}>
    <h2>Importar CV</h2>
    <input type="file" accept="application/pdf" onChange={e=>onFile(e.target.files?.[0])} />
    <textarea value={text} onChange={e=>setText(e.target.value)} rows={12} style={{width:"100%",marginTop:12}} placeholder="…o pega aquí el texto del CV" />
    <div><button onClick={onAnalyze}>Analizar con DeepSeek</button> <span>{status}</span></div>
  </div>);
}
