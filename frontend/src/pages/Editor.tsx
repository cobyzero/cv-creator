import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { emptyCv, type CvJson } from "../lib/types";
import { API, updateCv } from "../lib/api";
import { MinimalAts } from "../templates/MinimalAts";
export function Editor() {
  const { id } = useParams(); const loc = useLocation() as any;
  const [cv, setCv] = useState<CvJson>(loc.state || emptyCv);
  const [title, setTitle] = useState("CV"); const [msg, setMsg] = useState("");
  useEffect(()=>{ if(!loc.state && id){ fetch(`${API}/api/cvs`).then(r=>r.json()).then((all:any[])=>{ const f=all.find(x=>x.id===id); if(f){ setCv(JSON.parse(f.data)); setTitle(f.title); } }); } },[]);
  useEffect(()=>{ if(!id) return; const t=setTimeout(()=>{ updateCv(id!, title, cv).then(()=>setMsg("Guardado "+new Date().toLocaleTimeString())); },800); return ()=>clearTimeout(t); },[cv,title]);
  return (<div style={{display:"flex",gap:16,padding:16}}>
    <div style={{flex:1}} className="no-print">
      <h3>Editor</h3>
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Título" style={{width:"100%"}} />
      <input value={cv.personal.nombre} onChange={e=>setCv({...cv,personal:{...cv.personal,nombre:e.target.value}})} placeholder="Nombre" style={{width:"100%",marginTop:8}} />
      <input value={cv.personal.email||""} onChange={e=>setCv({...cv,personal:{...cv.personal,email:e.target.value}})} placeholder="Email" style={{width:"100%",marginTop:8}} />
      <textarea value={cv.resumen} onChange={e=>setCv({...cv,resumen:e.target.value})} rows={4} style={{width:"100%",marginTop:8}} placeholder="Resumen" />
      <textarea value={cv.skills.join(", ")} onChange={e=>setCv({...cv,skills:e.target.value.split(",").map(s=>s.trim()).filter(Boolean)})} rows={2} style={{width:"100%",marginTop:8}} placeholder="Skills coma-separadas" />
      <div><button onClick={()=>window.print()}>Exportar PDF (imprimir)</button> <span>{msg}</span></div>
    </div>
    <div style={{flex:1.2}}><MinimalAts data={cv} /></div>
  </div>);
}
