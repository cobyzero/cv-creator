import type { CvJson } from "../lib/types";
export function MinimalAts({ data }: { data: CvJson }) {
  return (
    <div style={{background:"white",color:"#111",padding:32,maxWidth:760,fontFamily:"Georgia, serif",lineHeight:1.5}}>
      <style>{`@media print{.no-print{display:none!important}}`}</style>
      <div style={{borderBottom:"2px solid #111",paddingBottom:8}}>
        <div style={{fontWeight:800,fontSize:22}}>{data.personal.nombre||"Sin nombre"}</div>
        <div style={{fontSize:12,opacity:0.7}}>{[data.personal.ciudad,data.personal.email,data.personal.telefono,data.personal.linkedin].filter(Boolean).join(" · ")}</div>
      </div>
      {data.resumen && (<><div style={{fontWeight:700,fontSize:11,letterSpacing:"0.1em",marginTop:12}}>RESUMEN</div><div style={{fontSize:13}}>{data.resumen}</div></>)}
      <div style={{fontWeight:700,fontSize:11,letterSpacing:"0.1em",marginTop:12}}>EXPERIENCIA</div>
      {data.experiencia.map((e,i)=>(<div key={i} style={{fontSize:13,marginTop:6}}><strong>{e.puesto}</strong> — {e.empresa} <span style={{opacity:0.6}}>{e.fechas}</span><ul>{e.bullets.map((b,j)=><li key={j}>{b}</li>)}</ul></div>))}
      <div style={{fontWeight:700,fontSize:11,letterSpacing:"0.1em",marginTop:12}}>EDUCACIÓN</div>
      {data.educacion.map((e,i)=>(<div key={i} style={{fontSize:13}}>{e.titulo} — {e.centro} <span style={{opacity:0.6}}>{e.fechas}</span></div>))}
      <div style={{fontWeight:700,fontSize:11,letterSpacing:"0.1em",marginTop:12}}>SKILLS</div>
      <div style={{fontSize:13}}>{data.skills.join(", ")}</div>
      {data.idiomas.length>0 && (<><div style={{fontWeight:700,fontSize:11,letterSpacing:"0.1em",marginTop:12}}>IDIOMAS</div><div style={{fontSize:13}}>{data.idiomas.join(", ")}</div></>)}
    </div>
  );
}
