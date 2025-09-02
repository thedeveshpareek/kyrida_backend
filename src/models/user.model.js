import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["attendee", "creator", "vendor", "venue_owner", "admin"],
      default: "attendee",
    },
    profileImage: { type: String },
    verified: { type: Boolean, default: false },
    suspended: { type: Boolean, default: false },
    banned: { type: Boolean, default: false },
    eventType: { type: String, trim: true },
    attendingFor: [{ type: String }], 
    state: { type: String, trim: true },
    city: { type: String, trim: true },
    eventJourneyStage: { type: String, trim: true },
    selectedExperiences: [{ type: String }], 
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
