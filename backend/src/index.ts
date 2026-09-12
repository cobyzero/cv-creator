import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
for (const p of [path.resolve(process.cwd(), "backend/.env"), path.resolve(process.cwd(), ".env"), path.resolve(__dirname, "../.env"), path.resolve(__dirname, "../../.env")]) {
  if (!dotenv.config({ path: p }).error) break;
}
import express from "express"; import cors from "cors";
import multer from "multer"; import pdf from "pdf-parse";
import { callDeepseek } from "./deepseek.js"; import { db } from "./db.js";
import { randomUUID, createHash } from "node:crypto";
const app = express(); app.use(cors()); app.use(express.json({limit:"2mb"}));
function textHash(s: string) { return createHash("sha256").update(s.normalize("NFC").replace(/\s+/g, " ").trim()).digest("hex"); }
const upload = multer({ storage: multer.memoryStorage() });
app.post("/api/import", upload.single("file"), async (req,res)=>{
  if(!req.file) return res.status(400).json({error:"falta PDF"});
  try {
    const parsed = await pdf(req.file.buffer);
    const raw_text = (parsed.text||"").trim();
    const hash = textHash(raw_text);
    if(raw_text.length<50) return res.json({scanned:true, raw_text, hash});
    res.json({scanned:false, raw_text, hash});
  } catch(e:any){ res.status(400).json({error:"PDF invalido: "+String(e.message||e)}); }
});
app.post("/api/analyze", async (req,res)=>{
  try{
    const raw = req.body.raw_text||"";
    const hash = textHash(raw);
    const hit = db.prepare("SELECT json_result FROM imports WHERE hash=?").get(hash) as any;
    if (hit?.json_result) return res.json({cv_json: JSON.parse(hit.json_result), cached: true, hash});
    const json = await callDeepseek(raw);
    db.prepare("INSERT OR IGNORE INTO imports VALUES(?,?,?,?,?,?)").run(randomUUID(), req.body.filename||"", raw.slice(0,5000), JSON.stringify(json).slice(0,20000), new Date().toISOString(), hash);
    res.json({cv_json: json, cached: false, hash}); }
  catch(e:any){ res.status(502).json({error:String(e.message||e)}); }
});
app.get("/api/cvs", (_req,res)=>{ res.json(db.prepare("SELECT * FROM cvs ORDER BY updated_at DESC").all()); });
app.post("/api/cvs", (req,res)=>{ const id=randomUUID(); const now=new Date().toISOString();
  db.prepare("INSERT INTO cvs VALUES(?,?,?,?,?,?)").run(id, req.body.title||"Sin titulo", JSON.stringify(req.body.data||{}), "minimal-ats", now, now);
  res.json({id}); });
app.put("/api/cvs/:id", (req,res)=>{ const now=new Date().toISOString();
  db.prepare("UPDATE cvs SET title=?, data=?, updated_at=? WHERE id=?").run(req.body.title, JSON.stringify(req.body.data), now, req.params.id);
  res.json({ok:true}); });
app.delete("/api/cvs/:id", (req,res)=>{ db.prepare("DELETE FROM cvs WHERE id=?").run(req.params.id); res.json({ok:true}); });
const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, ()=>console.log(`backend :${PORT}`));
