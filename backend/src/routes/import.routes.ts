import { Router } from "express";
import multer from "multer";
import { asyncHandler } from "../middlewares/errorHandler.js";
import { importPdf } from "../controllers/import.controller.js";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();
router.post("/", upload.single("file"), asyncHandler(importPdf));

export default router;
