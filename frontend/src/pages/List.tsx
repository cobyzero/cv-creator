import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listCvs } from "../lib/api";
export function List() {
  const [cvs,setCvs]=useState<any[]>([]);
  useEffect(()=>{ listCvs().then(setCvs); },[]);
  function exportJson(c:any){ const blob=new Blob([c.data],{type:"application/json"}); const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=`${c.title}.json`; a.click(); }
  if(cvs.length===0) return (<div style={{padding:24}}><h3>Mis CVs — vacío</h3><p>Aún no tienes CVs. <Link to="/">Importa tu primero</Link>.</p></div>);
  return (<div style={{padding:24}}><h3>Mis CVs ({cvs.length})</h3>{cvs.map(c=>(<div key={c.id} style={{border:"1px solid #ddd",padding:8,marginTop:8}}><Link to={`/editor/${c.id}`}>{c.title}</Link> <button onClick={()=>exportJson(c)}>Export JSON</button></div>))}</div>);
}
