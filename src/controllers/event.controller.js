import Event from "../models/event.model.js";
import Booking from "../models/booking.model.js";
import VendorBooking from "../models/vendorBooking.model.js";

// Create Event
export const createEvent = async (req, res) => {
  try {
    const { name, type, description, startDate, endDate, venueBookingId, vendorBookings, capacity, ticketPrice } = req.body;
    const banner = req.file ? `/uploads/${req.file.filename}` : null;

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ msg: "Invalid event date range" });
    }

    // Validate venue booking
    const venueBooking = await Booking.findById(venueBookingId);
    if (!venueBooking || venueBooking.creatorId.toString() !== req.user.id) {
      console.log("for event creation venue booking invalid");
      // return res.status(400).json({ msg: "Invalid or unauthorized venue booking" });
    }
    // if (venueBooking.status !== "confirmed") {
    //   return res.status(400).json({ msg: "Venue booking must be confirmed" });
    // }

    // Validate vendor bookings
    const validatedVendors = [];
    if (vendorBookings && vendorBookings.length > 0) {
      for (let vbId of vendorBookings) {
        const vb = await VendorBooking.findById(vbId);
        if (!vb || vb.creatorId.toString() !== req.user.id) {
          return res.status(400).json({ msg: `Invalid or unauthorized vendor booking: ${vbId}` });
        }
        if (vb.status !== "confirmed") {
          return res.status(400).json({ msg: `Vendor booking must be confirmed: ${vbId}` });
        }
        validatedVendors.push(vb._id);
      }
    }

    const event = await Event.create({
      creatorId: req.user.id,
      name,
      type,
      description,
      banner,
      startDate,
      endDate,
      venueBookingId,
      vendorBookings: validatedVendors,
      capacity,
      ticketPrice,
      status: "draft",
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get all events (creator-specific)
export const getMyEvents = async (req, res) => {
  try {
    // if (!req.user || !req.user.id) {
    //   return res.status(401).json({ msg: "Unauthorized: user not found" });
    // }
    const events = await Event.find({ creatorId: req.user.id })
      .populate("venueBookingId")
      .populate("vendorBookings");
    res.json(events);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get public events
export const getPublicEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "published" })
      .populate("venueBookingId")
      .populate("vendorBookings");
    res.json(events);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get event by ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("venueBookingId")
      .populate("vendorBookings")
      .populate("creatorId", "name email");
    if (!event) return res.status(404).json({ msg: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update Event (only creator)
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, creatorId: req.user.id },
      req.body,
      { new: true }
    );
    if (!event) return res.status(404).json({ msg: "Event not found or not authorized" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Publish Event
export const publishEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, creatorId: req.user.id },
      { status: "published" },
      { new: true }
    );
    if (!event) return res.status(404).json({ msg: "Event not found or not authorized" });
    res.json({ msg: "Event published", event });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Cancel Event
export const cancelEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, creatorId: req.user.id },
      { status: "cancelled" },
      { new: true }
    );
    if (!event) return res.status(404).json({ msg: "Event not found or not authorized" });
    res.json({ msg: "Event cancelled", event });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
