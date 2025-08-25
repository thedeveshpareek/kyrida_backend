import express from "express";
import { authMiddleware, requireRole } from "../middleware/auth.middleware.js";
import {
  createVendorBooking,
  getMyVendorBookings,
  updateVendorBookingStatus,
  cancelVendorBooking
} from "../controllers/vendorBooking.controller.js";

const router = express.Router();

// Creator books a vendor
router.post("/", authMiddleware, requireRole("creator"), createVendorBooking);

// Creator views own bookings
router.get("/me", authMiddleware, requireRole("creator"), getMyVendorBookings);

// Vendor confirms/rejects booking
router.patch("/:id/status", authMiddleware, requireRole("vendor"), updateVendorBookingStatus);

// Cancel booking (creator or vendor)
router.patch("/:id/cancel", authMiddleware, cancelVendorBooking);

export default router;
