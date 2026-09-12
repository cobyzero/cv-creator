import { Router } from "express";
import analyzeRoutes from "./analyze.routes.js";
import cvsRoutes from "./cvs.routes.js";
import importRoutes from "./import.routes.js";

const router = Router();
router.use("/import", importRoutes);
router.use("/analyze", analyzeRoutes);
router.use("/cvs", cvsRoutes);

export default router;
