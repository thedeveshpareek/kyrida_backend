import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ["wedding", "concert", "conference", "party", "other"], required: true },
    description: { type: String },
    banner: { type: String }, // main event image
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    venueBookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    vendorBookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "VendorBooking" }],

    capacity: { type: Number, default: 100 },
    ticketPrice: { type: Number, default: 0 },

    status: { type: String, enum: ["draft", "published", "cancelled"], default: "draft" },
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
