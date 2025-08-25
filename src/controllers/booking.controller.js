import Booking from "../models/booking.model.js";

// Request booking
export const createBooking = async (req, res) => {
  try {
    const { venueId, startDate, endDate } = req.body;

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ msg: "Invalid date range" });
    }

    // Check overlapping bookings
    const conflict = await Booking.findOne({
      venueId,
      status: { $in: ["pending", "confirmed"] }, // only active bookings
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } }, // overlap condition
      ],
    });

    if (conflict) {
      return res.status(400).json({ msg: "Venue already booked for this date range" });
    }

    const booking = await Booking.create({
      ...req.body,
      creatorId: req.user.id,
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get bookings for current user
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ creatorId: req.user.id }).populate("venueId");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update booking status (only owner can confirm/reject)
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id).populate("venueId");
    if (!booking) return res.status(404).json({ msg: "Booking not found" });

    if (String(booking.venueId.ownerId) !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    booking.status = status;
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// Cancel booking (creator or owner)
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("venueId");

    if (!booking) return res.status(404).json({ msg: "Booking not found" });

    // Allow cancel if: Creator = owner of booking OR Venue Owner
    if (
      String(booking.creatorId) !== req.user.id &&
      String(booking.venueId.ownerId) !== req.user.id
    ) {
      return res.status(403).json({ msg: "Not authorized to cancel this booking" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ msg: "Booking cancelled", booking });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};