import Venue from "../models/venue.model.js";

// Create a venue (with image upload)
// Create a venue (with image upload)
export const createVenue = async (req, res) => {
  try {
    const imageUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const venue = await Venue.create({
      ...req.body,
      ownerId: req.user.id,
      // images: imageUrls,
    });

    res.status(201).json(venue);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};



// Get all venues
// Get all venues with search & filter
export const getVenues = async (req, res) => {
  try {
    const { name, minCapacity, maxCapacity, minPrice, maxPrice, availability } = req.query;
    const filters = {};

    if (name) {
      filters.name = { $regex: name, $options: "i" }; // case-insensitive search
    }

    if (availability !== undefined) {
      filters.availability = availability === "true";
    }

    if (minCapacity || maxCapacity) {
      filters.capacity = {};
      if (minCapacity) filters.capacity.$gte = parseInt(minCapacity);
      if (maxCapacity) filters.capacity.$lte = parseInt(maxCapacity);
    }

    if (minPrice || maxPrice) {
      filters.pricePerDay = {};
      if (minPrice) filters.pricePerDay.$gte = parseInt(minPrice);
      if (maxPrice) filters.pricePerDay.$lte = parseInt(maxPrice);
    }

    const venues = await Venue.find(filters).populate("ownerId", "name email");
    res.json(venues);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// Get venue by ID
export const getVenueById = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id).populate("ownerId", "name email");
    if (!venue) return res.status(404).json({ msg: "Venue not found" });
    res.json(venue);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update venue
export const updateVenue = async (req, res) => {
  try {
    const venue = await Venue.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user.id }, // only owner can update
      req.body,
      { new: true }
    );
    if (!venue) return res.status(404).json({ msg: "Venue not found or not authorized" });
    res.json(venue);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Delete venue
export const deleteVenue = async (req, res) => {
  try {
    const venue = await Venue.findOneAndDelete({ _id: req.params.id, ownerId: req.user.id });
    if (!venue) return res.status(404).json({ msg: "Venue not found or not authorized" });
    res.json({ msg: "Venue deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
