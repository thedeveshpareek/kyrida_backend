import mongoose from "mongoose";

const venueSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    capacity: { type: Number, required: true },
    availability: { type: Boolean, default: true },
    pricePerDay: { type: Number, required: true },
    description: { type: String },
    rating: { type: Number, default: 0.0 },
    images: [{ type: String }] // array of image URLs
  },
  { timestamps: true }
);

export default mongoose.model("Venue", venueSchema);
