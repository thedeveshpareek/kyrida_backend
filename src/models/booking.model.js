import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" }, // optional until events module
    venueId: { type: mongoose.Schema.Types.ObjectId, ref: "Venue", required: true },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    escrowStatus: {
      type: String,
      enum: ["unfunded", "funded", "released"],
      default: "unfunded",
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    bookedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
