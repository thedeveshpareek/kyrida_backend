import express from "express";
import { uploadVendorFiles } from "../middleware/upload.middleware.js";
import { authMiddleware, requireRole, apiKeyOrRole } from "../middleware/auth.middleware.js";
import {
  createVendor,
  getVendors,
  getVendorById,
  updateVendor,
  deleteVendor
} from "../controllers/vendor.controller.js";

const router = express.Router();

// Public
router.get("/",authMiddleware, getVendors);
router.get("/:id", getVendorById);

// Vendor Owner Only
router.post("/", apiKeyOrRole("vendor"), uploadVendorFiles, createVendor);
router.put("/:id", authMiddleware, uploadVendorFiles ,requireRole("vendor"), updateVendor);
router.delete("/:id", authMiddleware,uploadVendorFiles, requireRole("vendor"), deleteVendor);

export default router;
