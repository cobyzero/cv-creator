import type { Request, Response } from "express";
import { HttpError } from "../middlewares/errorHandler.js";
import { analyzeText } from "../services/analyze.service.js";

export async function analyze(req: Request, res: Response): Promise<void> {
  try {
    res.json(await analyzeText(req.body.raw_text || "", req.body.filename || ""));
  } catch (e: any) {
    throw new HttpError(502, String(e.message || e));
  }
}
