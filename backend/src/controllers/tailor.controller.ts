import type { Request, Response } from "express";
import { HttpError } from "../middlewares/errorHandler.js";
import { tailorToJob } from "../services/tailor.service.js";

export async function tailor(req: Request, res: Response): Promise<void> {
  try {
    if (!req.body.cv) throw new HttpError(400, "falta cv");
    res.json(await tailorToJob(req.body.cv, req.body.vacante || ""));
  } catch (e: any) {
    if (e instanceof HttpError) throw e;
    throw new HttpError(502, String(e.message || e));
  }
}
