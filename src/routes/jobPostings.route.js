import express from "express";
import { getAllJobPostings, createJobPosting } from "../controllers/jobPosting.controller.js";
import { upload } from "../middleware/upload.middleware.js";
import { authMiddleware, requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/",authMiddleware, getAllJobPostings);
router.post("/",authMiddleware, requireRole("creator"), createJobPosting);

export default router;
