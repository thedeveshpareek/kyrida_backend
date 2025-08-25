import VendorBooking from "../models/vendorBooking.model.js";
import Vendor from "../models/vendor.model.js";

// Request vendor booking
export const createVendorBooking = async (req, res) => {
  try {
    const { vendorId, startDate, endDate } = req.body;

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ msg: "Invalid date range" });
    }

    // Check vendor exists
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ msg: "Vendor not found" });

    // Prevent overlapping bookings
    const conflict = await VendorBooking.findOne({
      vendorId,
      status: { $in: ["pending", "confirmed"] },
      $or: [{ startDate: { $lte: endDate }, endDate: { $gte: startDate } }],
    });

    if (conflict) {
      return res.status(400).json({ msg: "Vendor already booked in this date range" });
    }

    const booking = await VendorBooking.create({
      ...req.body,
      creatorId: req.user.id,
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get all bookings for current creator
export const getMyVendorBookings = async (req, res) => {
  try {
    const bookings = await VendorBooking.find({ creatorId: req.user.id }).populate("vendorId");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Vendor updates booking status
export const updateVendorBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await VendorBooking.findById(req.params.id).populate("vendorId");
    if (!booking) return res.status(404).json({ msg: "Booking not found" });

    // Only vendor owner can update
    if (String(booking.vendorId.ownerId) !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    booking.status = status;
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Cancel booking (creator or vendor)
export const cancelVendorBooking = async (req, res) => {
  try {
    const booking = await VendorBooking.findById(req.params.id).populate("vendorId");

    if (!booking) return res.status(404).json({ msg: "Booking not found" });

    if (
      String(booking.creatorId) !== req.user.id &&
      String(booking.vendorId.ownerId) !== req.user.id
    ) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ msg: "Booking cancelled", booking });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
