import mongoose from "mongoose";

const jobPostingSchema = new mongoose.Schema({
  eventTitle: { type: String, required: true },
  eventType: { type: String, required: true },
  serviceNeeded: { type: String, required: true },
  location: { type: String, required: true },
  eventDate: { type: Date, required: true },
  budgetRange: { type: String },
  expectedGuests: { type: String },
  eventDescription: { type: String },
  specificRequirements: { type: String },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

const JobPosting = mongoose.model("JobPosting", jobPostingSchema);
export default JobPosting;
