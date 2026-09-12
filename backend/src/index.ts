import express from "express"; import cors from "cors";
import multer from "multer"; import pdf from "pdf-parse";
import { callDeepseek } from "./deepseek.js"; import { db } from "./db.js";
import { randomUUID } from "node:crypto";
const app = express(); app.use(cors()); app.use(express.json({limit:"2mb"}));
const upload = multer({ storage: multer.memoryStorage() });
app.post("/api/import", upload.single("file"), async (req,res)=>{
  if(!req.file) return res.status(400).json({error:"falta PDF"});
  try {
    const parsed = await pdf(req.file.buffer);
    const raw_text = (parsed.text||"").trim();
    if(raw_text.length<50) return res.json({scanned:true, raw_text});
    res.json({scanned:false, raw_text});
  } catch(e:any){ res.status(400).json({error:"PDF invalido: "+String(e.message||e)}); }
});
app.post("/api/analyze", async (req,res)=>{
  try{ const json = await callDeepseek(req.body.raw_text||"");
    db.prepare("INSERT INTO imports VALUES(?,?,?,?,?)").run(randomUUID(), req.body.filename||"", (req.body.raw_text||"").slice(0,5000), JSON.stringify(json).slice(0,5000), new Date().toISOString());
    res.json({cv_json: json}); }
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
app.listen(3001, ()=>console.log("backend :3001"));
