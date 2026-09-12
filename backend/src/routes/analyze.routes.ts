import { Router } from "express";
import { asyncHandler } from "../middlewares/errorHandler.js";
import { analyze } from "../controllers/analyze.controller.js";

const router = Router();
router.post("/", asyncHandler(analyze));

export default router;
