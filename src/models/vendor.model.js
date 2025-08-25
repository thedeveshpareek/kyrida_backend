import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // vendor user
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["catering", "decoration", "music", "photography", "other"],
      required: true
    },
    description: { type: String },
    contact: { type: String, required: true },
    location: { type: String },
    priceRange: { min: Number, max: Number },
    availability: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    images: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Vendor", vendorSchema);
