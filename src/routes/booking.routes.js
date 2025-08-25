import express from "express";
import { authMiddleware, requireRole } from "../middleware/auth.middleware.js";
import {
  createBooking,
  getMyBookings,
  updateBookingStatus,
  cancelBooking
} from "../controllers/booking.controller.js";

const router = express.Router();

// Attendee / Creator can request booking
router.post("/", authMiddleware, requireRole("creator"), createBooking);
router.get("/me", authMiddleware, requireRole("creator"), getMyBookings);

// Venue owner confirms/cancels
router.patch("/:id/status", authMiddleware, requireRole("venue_owner"), updateBookingStatus);
// Cancel booking (creator or venue_owner)
router.patch("/:id/cancel", authMiddleware, cancelBooking);

export default router;




// import { cancelBooking } from "../controllers/booking.controller.js";

// // Creator can request booking
// router.post("/", authMiddleware, requireRole("creator"), createBooking);

// // Cancel booking (creator or venue_owner)
// router.patch("/:id/cancel", authMiddleware, cancelBooking);
