import express from "express";
import { authMiddleware, requireRole } from "../middleware/auth.middleware.js";
import {
  createVenue,
  getVenues,
  getVenueById,
  updateVenue,
  deleteVenue
} from "../controllers/venue.controller.js";
import { upload } from "../middleware/upload.middleware.js";
const router = express.Router();

// Public
router.get("/", getVenues);
router.get("/:id", getVenueById);

// Protected (only venue_owner can manage)
router.post("/", authMiddleware, requireRole("venue_owner"),upload.array("images", 5), createVenue);
router.put("/:id", authMiddleware, requireRole("venue_owner"), updateVenue);
router.delete("/:id", authMiddleware, requireRole("venue_owner"), deleteVenue);

export default router;





// // Add upload middleware to "create venue" route
// router.post(
//   "/",
//   authMiddleware,
//   requireRole("venue_owner"),
//   upload.array("images", 5),  // max 5 images
//   createVenue
// );
