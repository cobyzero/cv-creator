import Database from "better-sqlite3";
export const db = new Database("cv.db");
db.exec(`CREATE TABLE IF NOT EXISTS cvs(id TEXT PRIMARY KEY, title TEXT, data TEXT, template TEXT DEFAULT 'minimal-ats', created_at TEXT, updated_at TEXT);
CREATE TABLE IF NOT EXISTS imports(id TEXT PRIMARY KEY, filename TEXT, raw_text TEXT, json_result TEXT, created_at TEXT);`);
try { db.exec(`ALTER TABLE imports ADD COLUMN hash TEXT;`); } catch { /* ya existe */ }
db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS idx_imports_hash ON imports(hash);`);
