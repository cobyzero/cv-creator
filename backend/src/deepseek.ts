import { CvSchema } from "./schema.js";
const SYS = "Devuelve SOLO JSON valido con schema: personal{nombre,email,telefono,ciudad,linkedin}, resumen, experiencia[{puesto,empresa,fechas,bullets[]}], educacion[], skills[], idiomas[]. Sin markdown.";
function extractJson(txt: string) {
  const noFence = txt.replace(/```json|```/g, "").trim();
  const start = noFence.indexOf("{");
  const end = noFence.lastIndexOf("}");
  return start >= 0 && end > start ? noFence.slice(start, end + 1) : noFence;
}
export async function callDeepseek(raw_text:string){
  const key = process.env.DEEPSEEK_API_KEY; if(!key) throw new Error("falta DEEPSEEK_API_KEY en backend/.env");
  const body = { model:"deepseek-chat", messages:[{role:"system",content:SYS},{role:"user",content:raw_text.slice(0,12000)}], temperature:0.2 };
  const r = await fetch("https://api.deepseek.com/chat/completions", {method:"POST", headers:{"Content-Type":"application/json","Authorization":`Bearer ${key}`}, body:JSON.stringify(body), signal:AbortSignal.timeout(30000)});
  if(!r.ok) throw new Error("deepseek "+r.status);
  const j:any = await r.json(); const txt = j.choices?.[0]?.message?.content||"";
  let parsed:any; try{ parsed = JSON.parse(extractJson(txt));}catch{ const r2 = await fetch("https://api.deepseek.com/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${key}`},body:JSON.stringify({model:"deepseek-chat",messages:[{role:"user",content:"Corrige a JSON valido:\n"+txt}],temperature:0})}); const j2:any=await r2.json(); parsed=JSON.parse(extractJson(j2.choices?.[0]?.message?.content||"")); }
  return CvSchema.parse(parsed);
}
