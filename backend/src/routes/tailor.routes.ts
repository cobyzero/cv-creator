import { Router } from "express";
import { asyncHandler } from "../middlewares/errorHandler.js";
import { tailor } from "../controllers/tailor.controller.js";

const router = Router();
router.post("/", asyncHandler(tailor));

export default router;
