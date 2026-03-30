import express from "express";
import { uploadReport } from "../controllers/report.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getUserReports } from "../controllers/report.controller.js";
import { processReport } from "../controllers/report.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/upload", verifyJWT, upload.single("file"), uploadReport);
router.post("/process", verifyJWT, processReport);
router.get("/", verifyJWT, getUserReports);

export default router;