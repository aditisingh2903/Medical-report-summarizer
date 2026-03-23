import express from "express";
import { uploadReport } from "../controllers/report.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getUserReports } from "../controllers/report.controller.js";
import { processReport } from "../controllers/report.controller.js";

const router = express.Router();

router.post("/upload", verifyJWT, uploadReport);
router.get("/", verifyJWT, getUserReports);
router.post("/process", verifyJWT, processReport);

export default router;