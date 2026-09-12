import { Router } from "express";
import { asyncHandler } from "../middlewares/errorHandler.js";
import { create, list, remove, update } from "../controllers/cvs.controller.js";

const router = Router();
router.get("/", asyncHandler(list));
router.post("/", asyncHandler(create));
router.put("/:id", asyncHandler(update));
router.delete("/:id", asyncHandler(remove));

export default router;
