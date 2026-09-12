import { randomUUID } from "node:crypto";
import { db } from "../db.js";
import type { CvJson } from "../schemas/cv.schema.js";

const TEMPLATE = "minimal-ats";

export function listCvs() {
  return db.prepare("SELECT * FROM cvs ORDER BY updated_at DESC").all();
}

export function createCv(title: string, data: CvJson): string {
  const id = randomUUID();
  const now = new Date().toISOString();
  db.prepare("INSERT INTO cvs VALUES(?,?,?,?,?,?)").run(id, title, JSON.stringify(data), TEMPLATE, now, now);
  return id;
}

export function updateCv(id: string, title: string, data: CvJson): void {
  db.prepare("UPDATE cvs SET title=?, data=?, updated_at=? WHERE id=?").run(
    title, JSON.stringify(data), new Date().toISOString(), id,
  );
}

export function deleteCv(id: string): void {
  db.prepare("DELETE FROM cvs WHERE id=?").run(id);
}
