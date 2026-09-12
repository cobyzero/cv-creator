# CV Creator Local — Design Spec

Fecha: 2026-09-12
Estado: validado con usuario
Stack elegido: Plan A — Vite + React + TS + Express mini-API + SQLite + DeepSeek API cloud

## 1. Objetivo
App web local para subir un PDF o pegar texto, analizarlo con DeepSeek API y montarlo en un template nuevo editable. Todo persistido localmente salvo la llamada a DeepSeek.

## 2. Arquitectura
- Frontend: Vite + React + TS + Tailwind, puertos `:5173`
  - Rutas: `/` Importar, `/editor/:id` Editor + Preview, `/cvs` Mis CVs
  - Estado: CV JSON en memoria + autosave a backend (debounce 800ms)
  - Export: CSS print (`@media print`) + `window.print()` → PDF
- Backend: Node Express en `:3001`
  - `POST /api/import` (multipart PDF → `pdf-parse` → `raw_text`)
  - `POST /api/analyze` (`raw_text` → DeepSeek `deepseek-chat` → JSON validado con Zod → `cv_json`)
  - `GET/POST/PUT/DELETE /api/cvs` (CRUD SQLite)
  - API key solo en `backend/.env` (`DEEPSEEK_API_KEY`), nunca expuesta al frontend
- Datos: SQLite `cv.db` vía `better-sqlite3`
  - `cvs(id TEXT PK, title TEXT, data JSON, template TEXT DEFAULT 'minimal-ats', created_at, updated_at)`
  - `imports(id, filename, raw_text, json_result, created_at)` para auditoría
  - Export/import JSON por CV para backup y portabilidad

## 3. Flujo de datos
1. Usuario sube PDF o pega texto → frontend → `POST /api/import` (solo PDF)
2. Backend extrae `raw_text`. Si <50 chars → respuesta `scanned:true`, frontend pide pegado manual (sin OCR en MVP)
3. Frontend → `POST /api/analyze` con `raw_text`
4. Backend construye prompt estricto: "Devuelve SOLO JSON válido con este schema: personal{nombre,email,telefono,ciudad,linkedin}, resumen, experiencia[{puesto,empresa,fechas,bullets[]}], educacion[], skills[], idiomas[]. Sin markdown."
5. Llama a `https://api.deepseek.com/chat/completions`. Valida con Zod. Si falla → 1 reintento con prompt "corrige el JSON anterior". Si sigue fallando → devuelve `raw_text` + error para edición manual.
6. Frontend monta `cv_json` en template Minimal ATS, permite edición manual, guarda en SQLite.

## 4. Templates y estética
- MVP: solo **A — Minimal ATS** (1 columna, B/N, máxima compatibilidad ATS)
- Dirección estética: Swiss / International Typographic (referencia: Harvard resume). Jerarquía por peso y espaciado, sin color en impresión.
- Fase 2: B Sidebar moderno, C Ejecutivo cálido.
- Estados obligatorios en editor:
  - Vacío (sin CV / primera vez): CTA importar
  - Cargando DeepSeek: skeleton + "Analizando con DeepSeek…"
  - Error API/key/offline: banner con causa y acción (revisar `.env`, reintentar, editar manual)
  - Éxito: preview + editor lado a lado
  - PDF escaneado: aviso + textarea manual

## 5. Manejo de errores
- JSON inválido de DeepSeek → reintento x1, luego modo manual sin pérdida de `raw_text`
- Sin API key → `500` con mensaje explícito, frontend muestra setup
- Sin internet / timeout DeepSeek (30s) → error recuperable, botón reintentar
- PDF corrupto o no-PDF → `400`, mensaje en frontend
- Todo error de import/analyze se guarda en `imports` con timestamp para debug

## 6. Config local y seguridad
- `npm run dev` levanta ambos (concurrently): `frontend` + `backend`
- `.env` (backend): `DEEPSEEK_API_KEY`, `PORT=3001`
- `.gitignore`: `.env`, `*.db`, `data/`, `.opencode/`, `node_modules/`, `dist/`
- Solo el texto plano sale a `api.deepseek.com`. PDFs, DB y JSON quedan en disco local.

## 7. Testing MVP (YAGNI)
- Checklist manual: subir PDF → ver JSON → editar campo → recargar (persiste) → export print-PDF legible
- Validación Zod en backend como test de contrato implícito
- Sin Playwright ni OCR en MVP

## 8. Fuera de alcance (fase 2)
- Auth multi-usuario, deploy cloud, Tauri/Electron, OCR local, ATS scorer, múltiples templates, i18n.

## 9. Decisiones validadas
- DeepSeek: API cloud (no local) — acepta que el texto sale a la nube
- Stack: Vite simple (no Next.js)
- Storage: SQLite + export JSON (no solo JSON)
- Template MVP: Minimal ATS
