import type { Request, Response } from "express";
import * as cvs from "../services/cvs.service.js";

export async function list(req: Request, res: Response): Promise<void> {
  res.json(cvs.listCvs());
}

export async function create(req: Request, res: Response): Promise<void> {
  res.json({ id: cvs.createCv(req.body.title || "Sin titulo", req.body.data || {}) });
}

export async function update(req: Request, res: Response): Promise<void> {
  const { id } = req.params as { id: string };
  cvs.updateCv(id, req.body.title, req.body.data);
  res.json({ ok: true });
}

export async function remove(req: Request, res: Response): Promise<void> {
  const { id } = req.params as { id: string };
  cvs.deleteCv(id);
  res.json({ ok: true });
}
