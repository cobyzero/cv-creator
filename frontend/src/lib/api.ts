export const API="http://localhost:3001";
export async function importPdf(f:File){ const fd=new FormData(); fd.append("file",f); const r=await fetch(`${API}/api/import`,{method:"POST",body:fd}); return r.json(); }
export async function analyze(raw_text:string, filename?:string){ const r=await fetch(`${API}/api/analyze`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({raw_text, filename})}); if(!r.ok) throw new Error(await r.text()); return r.json(); }
export async function saveCv(title:string,data:any){ const r=await fetch(`${API}/api/cvs`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title,data})}); return r.json(); }
export async function listCvs(){ const r=await fetch(`${API}/api/cvs`); return r.json(); }
export async function updateCv(id:string,title:string,data:any){ await fetch(`${API}/api/cvs/${id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({title,data})}); }
