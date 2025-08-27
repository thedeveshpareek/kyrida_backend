import express from "express";
import { upload } from "../middleware/upload.middleware.js";
import { authMiddleware, requireRole } from "../middleware/auth.middleware.js";
import {
  createEvent,
  getMyEvents,
  getPublicEvents,
  getEventById,
  updateEvent,
  publishEvent,
  cancelEvent
} from "../controllers/event.controller.js";

const router = express.Router();

// Public
router.get("/public", getPublicEvents);
router.get("/:id", getEventById);

// Creator
router.post("/", authMiddleware, requireRole("creator"), upload.single("banner"), createEvent);
router.get("/me/all", authMiddleware, requireRole("creator"), getMyEvents);
router.put("/:id", authMiddleware, requireRole("creator"), updateEvent);
router.patch("/:id/publish", authMiddleware, requireRole("creator"), publishEvent);
router.patch("/:id/cancel", authMiddleware, requireRole("creator"), cancelEvent);

export default router;
