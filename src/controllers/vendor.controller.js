import Vendor from "../models/vendor.model.js";
import mongoose from "mongoose";

// Create Vendor profile
export const createVendor = async (req, res) => {
  try {
    const imageUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    // Determine ownerId based on auth method
    let ownerId;
    if (req.authMethod === "api_key") {
      // When using API key, ownerId is not required from request body
      ownerId = null;
    } else {
      // JWT path
      ownerId = req.user?.id;
      if (!ownerId) {
        return res.status(401).json({ msg: "Unauthorized" });
      }
    }

    const vendorData = {
      ...req.body,
      images: imageUrls,
    };

    // Ensure body cannot override ownerId
    vendorData.ownerId = ownerId;

    const vendor = await Vendor.create(vendorData);

    res.status(201).json(vendor);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get all vendors with search & filter
// Get all vendors with search, filter, sort, pagination
export const getVendors = async (req, res) => {
  try {
    const {
      category,
      location,
      minPrice,
      maxPrice,
      availability,
      name,
      sortBy,
      sortOrder = "asc",
      page = 1,
      limit = 10
    } = req.query;

    const filters = {};

    if (category) filters.category = category;
    if (location) filters.location = { $regex: location, $options: "i" };
    if (availability !== undefined) filters.availability = availability === "true";
    if (name) filters.name = { $regex: name, $options: "i" };

    if (minPrice || maxPrice) {
      filters["priceRange.min"] = {};
      filters["priceRange.max"] = {};
      if (minPrice) filters["priceRange.min"].$gte = parseInt(minPrice);
      if (maxPrice) filters["priceRange.max"].$lte = parseInt(maxPrice);
    }

    // Sorting
    const sortOptions = {};
    if (sortBy) {
      const allowedSort = ["priceRange.min", "rating", "createdAt"];
      if (allowedSort.includes(sortBy)) {
        sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
      }
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const vendors = await Vendor.find(filters)
      .populate("ownerId", "name email")
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Vendor.countDocuments(filters);

    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
      vendors
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// Get vendor by ID
export const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id).populate("ownerId", "name email");
    if (!vendor) return res.status(404).json({ msg: "Vendor not found" });
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update vendor profile (only vendor owner can update)
export const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user.id },
      req.body,
      { new: true }
    );
    if (!vendor) return res.status(404).json({ msg: "Vendor not found or not authorized" });
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Delete vendor profile
export const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findOneAndDelete({ _id: req.params.id, ownerId: req.user.id });
    if (!vendor) return res.status(404).json({ msg: "Vendor not found or not authorized" });
    res.json({ msg: "Vendor deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
