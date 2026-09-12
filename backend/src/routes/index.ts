import { Router } from "express";
import analyzeRoutes from "./analyze.routes.js";
import cvsRoutes from "./cvs.routes.js";
import importRoutes from "./import.routes.js";
import tailorRoutes from "./tailor.routes.js";

const router = Router();
router.use("/import", importRoutes);
router.use("/analyze", analyzeRoutes);
router.use("/cvs", cvsRoutes);
router.use("/tailor", tailorRoutes);

export default router;
