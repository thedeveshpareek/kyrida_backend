import express from "express";
import { upload } from "../middleware/upload.middleware.js";
import { authMiddleware, requireRole } from "../middleware/auth.middleware.js";
import {
  createVendor,
  getVendors,
  getVendorById,
  updateVendor,
  deleteVendor
} from "../controllers/vendor.controller.js";

const router = express.Router();

// Public
router.get("/", getVendors);
router.get("/:id", getVendorById);

// Vendor Owner Only
router.post("/", authMiddleware, requireRole("vendor"), upload.array("images", 5), createVendor);
router.put("/:id", authMiddleware, requireRole("vendor"), updateVendor);
router.delete("/:id", authMiddleware, requireRole("vendor"), deleteVendor);

export default router;
