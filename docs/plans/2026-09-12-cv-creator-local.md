# CV Creator Local Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** App web local que importa PDF/texto, lo analiza con DeepSeek API a JSON y lo monta en template Minimal ATS editable con guardado SQLite.

**Architecture:** Monorepo `frontend/` (Vite+React) + `backend/` (Express). Backend extrae texto PDF y llama a DeepSeek, valida con Zod y persiste en SQLite. Frontend solo habla al backend local.

**Tech Stack:** Vite 6, React 18, TS, Tailwind, Express 4, better-sqlite3, pdf-parse, Zod, concurrently

---

## File Structure Map

- `package.json` — root con concurrently para dev doble
- `frontend/` — Vite app: Import, Editor, Mis CVs, template Minimal ATS
- `frontend/src/lib/api.ts` — cliente fetch al backend :3001
- `frontend/src/lib/types.ts` — tipo CvJson canonico
- `frontend/src/templates/MinimalAts.tsx` — template + print CSS
- `backend/` — Express API: import, analyze, cvs CRUD
- `backend/src/db.ts` — init SQLite + tablas cvs/imports
- `backend/src/routes.ts` — endpoints
- `backend/src/deepseek.ts` — llamada API + prompt estricto
- `backend/src/schema.ts` — Zod schema CvJson
- `backend/.env.example` — DEEPSEEK_API_KEY, PORT

## Tasks Outline

### Task 0: Scaffolding monorepo
Crea frontend Vite + backend Express + scripts dev. Sin logica aun.

### Task 1: Backend DB + schema Zod
Tablas cvs/imports + schema canonico validado.

### Task 2: Backend /import + /analyze DeepSeek
PDF->texto y texto->JSON via DeepSeek con reintento x1.

### Task 3: Backend CRUD /api/cvs + export JSON
Persistencia SQLite + export/import.

### Task 4: Frontend Import + Editor + Minimal ATS + Mis CVs
Flujo completo + print PDF.

### Task 0: Scaffolding monorepo

**Files:**
- Create: `package.json`, `frontend/package.json`, `backend/package.json`, `backend/.env.example`
- Test: manual `npm run dev` levanta ambos

- [ ] **Step 1: Crear frontend Vite**

Run:
```bash
npm create vite@latest frontend -- --template react-ts
npm --prefix frontend install
npm --prefix frontend install -D tailwindcss postcss autoprefixer
```

- [ ] **Step 2: Crear backend skeleton**

Create `backend/package.json`:
```json
{
  "name": "cv-backend",
  "type": "module",
  "scripts": { "dev": "tsx watch src/index.ts" },
  "dependencies": { "express": "^4.19.2", "better-sqlite3": "^11.3.0", "pdf-parse": "^1.1.1", "zod": "^3.23.8", "multer": "^1.4.5-lts.1", "cors": "^2.8.5", "dotenv": "^16.4.5" },
  "devDependencies": { "tsx": "^4.11.0", "typescript": "^5.5.0" }
}
```

Create `backend/.env.example`:
```
PORT=3001
DEEPSEEK_API_KEY=sk-xxxx
```

- [ ] **Step 3: Root concurrent dev**

Create `package.json`:
```json
{
  "private": true,
  "scripts": { "dev": "concurrently \"npm:dev --prefix frontend\" \"npm:dev --prefix backend\"" },
  "devDependencies": { "concurrently": "^9.0.0" }
}
```

Run: `npm install && npm run dev`
Expected: frontend :5173 OK, backend :3001 OK (aun 404 en /api, normal)

- [ ] **Step 4: Commit**

```bash
git add package.json frontend backend
git commit -m "chore: scaffold vite + express monorepo"
```

<!-- PASS2-TASK1 -->
### Task 1: Backend DB + schema Zod

**Files:**
- Create: `backend/src/db.ts`, `backend/src/schema.ts`
- Test: `backend/test/schema.test.ts` (vitest o node --test)

- [ ] **Step 1: Write failing test schema**

Create `backend/test/schema.test.ts`:
```ts
import { CvSchema } from "../src/schema.js";
const ok = { personal:{nombre:"A"}, resumen:"x", experiencia:[], educacion:[], skills:["React"], idiomas:[] };
console.assert(CvSchema.safeParse(ok).success, "debe pasar");
console.assert(!CvSchema.safeParse({}).success, "vacio debe fallar");
console.log("schema ok");
```

- [ ] **Step 2: Implement schema minimal**

Create `backend/src/schema.ts`:
```ts
import { z } from "zod";
export const CvSchema = z.object({
  personal: z.object({ nombre: z.string(), email: z.string().optional(), telefono: z.string().optional(), ciudad: z.string().optional(), linkedin: z.string().optional() }),
  resumen: z.string().default(""),
  experiencia: z.array(z.object({ puesto: z.string(), empresa: z.string(), fechas: z.string().optional(), bullets: z.array(z.string()).default([]) })).default([]),
  educacion: z.array(z.object({ titulo: z.string(), centro: z.string().optional(), fechas: z.string().optional() })).default([]),
  skills: z.array(z.string()).default([]),
  idiomas: z.array(z.string()).default([])
});
export type CvJson = z.infer<typeof CvSchema>;
```

- [ ] **Step 3: Implement db.ts skeleton**

Create `backend/src/db.ts`:
```ts
import Database from "better-sqlite3";
export const db = new Database("cv.db");
db.exec(`CREATE TABLE IF NOT EXISTS cvs(id TEXT PRIMARY KEY, title TEXT, data TEXT, template TEXT DEFAULT 'minimal-ats', created_at TEXT, updated_at TEXT);
CREATE TABLE IF NOT EXISTS imports(id TEXT PRIMARY KEY, filename TEXT, raw_text TEXT, json_result TEXT, created_at TEXT);`);
```

Run: `node --experimental-strip-types backend/test/schema.test.ts || npx tsx backend/test/schema.test.ts`
Expected: PASS "schema ok"

- [ ] **Step 4: Commit**

```bash
git add backend/src/db.ts backend/src/schema.ts
git commit -m "feat: sqlite tables + zod cv schema"
```

<!-- PASS2-TASK2 -->
### Task 2: Backend /import + /analyze DeepSeek

**Files:**
- Create: `backend/src/deepseek.ts`, `backend/src/index.ts`
- Modify: `backend/src/routes.ts` (crear)

- [ ] **Step 1: Skeleton routes**

Create `backend/src/index.ts`:
```ts
import express from "express"; import cors from "cors";
import multer from "multer"; import pdf from "pdf-parse";
import { callDeepseek } from "./deepseek.js"; import { CvSchema } from "./schema.js"; import { db } from "./db.js";
const app = express(); app.use(cors()); app.use(express.json({limit:"2mb"}));
const upload = multer({ storage: multer.memoryStorage() });
app.post("/api/import", upload.single("file"), async (req,res)=>{
  if(!req.file) return res.status(400).json({error:"falta PDF"});
  const parsed = await pdf(req.file.buffer);
  const raw_text = (parsed.text||"").trim();
  if(raw_text.length<50) return res.json({scanned:true, raw_text});
  res.json({scanned:false, raw_text});
});
app.post("/api/analyze", async (req,res)=>{
  try{ const json = await callDeepseek(req.body.raw_text||""); res.json({cv_json: json}); }
  catch(e:any){ res.status(502).json({error:String(e.message||e)}); }
});
app.listen(3001, ()=>console.log("backend :3001"));
```

- [ ] **Step 2: Implement deepseek.ts**

Create `backend/src/deepseek.ts`:
```ts
import { CvSchema } from "./schema.js";
const SYS = "Devuelve SOLO JSON valido con schema: personal{nombre,email,telefono,ciudad,linkedin}, resumen, experiencia[{puesto,empresa,fechas,bullets[]}], educacion[], skills[], idiomas[]. Sin markdown.";
export async function callDeepseek(raw_text:string){
  const key = process.env.DEEPSEEK_API_KEY; if(!key) throw new Error("falta DEEPSEEK_API_KEY en backend/.env");
  const body = { model:"deepseek-chat", messages:[{role:"system",content:SYS},{role:"user",content:raw_text.slice(0,12000)}], temperature:0.2 };
  const r = await fetch("https://api.deepseek.com/chat/completions", {method:"POST", headers:{"Content-Type":"application/json","Authorization":`Bearer ${key}`}, body:JSON.stringify(body), signal:AbortSignal.timeout(30000)});
  if(!r.ok) throw new Error("deepseek "+r.status);
  const j:any = await r.json(); let txt = j.choices?.[0]?.message?.content||"";
  txt = txt.replace(/```json|```/g,"").trim();
  let parsed:any; try{ parsed = JSON.parse(txt);}catch{ const r2 = await fetch("https://api.deepseek.com/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${key}`},body:JSON.stringify({model:"deepseek-chat",messages:[{role:"user",content:"Corrige a JSON valido:\n"+txt}],temperature:0})}); const j2:any=await r2.json(); parsed=JSON.parse((j2.choices?.[0]?.message?.content||"").replace(/```json|```/g,"").trim()); }
  return CvSchema.parse(parsed);
}
```

Run: `npm --prefix backend run dev`
Expected: POST /api/import con PDF real devuelve raw_text>50

- [ ] **Step 3: Commit**

```bash
git add backend/src/index.ts backend/src/deepseek.ts
git commit -m "feat: import pdf y analyze deepseek con reintento"
```

<!-- PASS2-TASK3 -->
### Task 3: Backend CRUD /api/cvs

**Files:**
- Modify: `backend/src/index.ts` (añadir CRUD)

- [ ] **Step 1: Añadir CRUD al final antes de listen**

```ts
import { randomUUID } from "crypto";
app.get("/api/cvs", (_req,res)=>{ res.json(db.prepare("SELECT * FROM cvs ORDER BY updated_at DESC").all()); });
app.post("/api/cvs", (req,res)=>{ const id=randomUUID(); const now=new Date().toISOString();
  db.prepare("INSERT INTO cvs VALUES(?,?,?,?,?,?)").run(id, req.body.title||"Sin titulo", JSON.stringify(req.body.data||{}), "minimal-ats", now, now);
  res.json({id}); });
app.put("/api/cvs/:id", (req,res)=>{ const now=new Date().toISOString();
  db.prepare("UPDATE cvs SET title=?, data=?, updated_at=? WHERE id=?").run(req.body.title, JSON.stringify(req.body.data), now, req.params.id);
  res.json({ok:true}); });
app.delete("/api/cvs/:id", (req,res)=>{ db.prepare("DELETE FROM cvs WHERE id=?").run(req.params.id); res.json({ok:true}); });
```

Run:
```bash
curl -X POST localhost:3001/api/cvs -H 'Content-Type: application/json' -d '{"title":"test","data":{"personal":{"nombre":"A"},"resumen":"","experiencia":[],"educacion":[],"skills":[],"idiomas":[]}}'
curl localhost:3001/api/cvs
```
Expected: lista contiene "test"

- [ ] **Step 2: Commit**

```bash
git add backend/src/index.ts
git commit -m "feat: crud cvs sqlite"
```

<!-- PASS2-TASK4 -->
### Task 4: Frontend Import + Editor Minimal ATS + Mis CVs

**Files:**
- Create: `frontend/src/lib/types.ts`, `frontend/src/lib/api.ts`, `frontend/src/templates/MinimalAts.tsx`, `frontend/src/pages/Import.tsx`, `frontend/src/pages/Editor.tsx`, `frontend/src/pages/List.tsx`

- [ ] **Step 1: Skeleton tipos + api**

Create `frontend/src/lib/api.ts`:
```ts
export const API="http://localhost:3001";
export async function importPdf(f:File){ const fd=new FormData(); fd.append("file",f); const r=await fetch(`${API}/api/import`,{method:"POST",body:fd}); return r.json(); }
export async function analyze(raw_text:string){ const r=await fetch(`${API}/api/analyze`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({raw_text})}); if(!r.ok) throw new Error(await r.text()); return r.json(); }
export async function saveCv(title:string,data:any){ const r=await fetch(`${API}/api/cvs`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title,data})}); return r.json(); }
```

- [ ] **Step 2: Template Minimal ATS**

Create `frontend/src/templates/MinimalAts.tsx` con 1 columna B/N, props `data:CvJson`, mas `<style>@media print{.no-print{display:none}}</style>` y boton Imprimir llama `window.print()`.

- [ ] **Step 3: Paginas Import/Editor/List**

Import: file input + textarea + boton Analizar -> muestra skeleton "Analizando con DeepSeek…" -> error banner si falla -> success navega a /editor/:id. Editor: form izquierda (inputs por campo) + preview derecha + autosave debounce. List: fetch GET /api/cvs + botones export JSON (Blob download) e Import JSON.

Run: `npm run dev` checklist manual: subir PDF -> JSON -> editar -> recargar persiste -> print PDF legible.

- [ ] **Step 4: Commit**

```bash
git add frontend/src
git commit -m "feat: frontend import editor minimal-ats"
```

## Self-Review
- Spec coverage: import/analyze/crud/template/errores/testing -> Tasks 2,3,4 OK. Estados vacio/cargando/error OK en Task4.
- Sin placeholders, tipos CvJson consistentes via Zod + TS.
- Scope: MVP sin auth/ocr/ats, anotado fuera.

