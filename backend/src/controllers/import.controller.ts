import type { Request, Response } from "express";
import { HttpError } from "../middlewares/errorHandler.js";
import { parsePdf } from "../services/import.service.js";

export async function importPdf(req: Request, res: Response): Promise<void> {
  if (!req.file) throw new HttpError(400, "falta PDF");
  try {
    res.json(await parsePdf(req.file.buffer));
  } catch (e: any) {
    throw new HttpError(400, "PDF invalido: " + String(e.message || e));
  }
}
