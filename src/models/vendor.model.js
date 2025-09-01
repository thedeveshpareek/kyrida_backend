import mongoose from "mongoose";

const featureSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true }
});

const pricingTierSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  color: { type: String },
  bgColor: { type: String },
  price: { type: Number, required: true },
  features: [featureSchema]
});

const serviceSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  pricingTiers: [pricingTierSchema]
});

const portfolioSchema = new mongoose.Schema({
  type: { type: String, enum: ["file", "image", "link"], required: true },
  url: { type: String, required: true },
  name: { type: String }, // optional - original file name or label
});


const vendorSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["catering", "decoration", "music", "photography", "other"],
      required: true
    },
    description: { type: String },
    // contact: { type: String, required: true },
    // location: { type: String },
    // priceRange: { min: Number, max: Number },
    availability: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },

    // 👇 New field for single profile image
    profileImage: { type: String },

    // 👇 Multiple gallery images (optional)
    // images: [{ type: String }],

    // 👇 New fields
    services: [serviceSchema],
    // 👇 Portfolio with files + images + links
    portfolio: [portfolioSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Vendor", vendorSchema);
