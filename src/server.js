import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import venueRoutes from "./routes/venue.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import vendorRoutes from "./routes/vendor.routes.js";
import eventRoutes from "./routes/event.routes.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/vendors", vendorRoutes); // Vendor-s
app.use("/api/events", eventRoutes); // Event Planners

app.get("/test", (req, res) => {
  res.json({ msg: "Server is working fine!" });
});


// Start server after DB connection
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
});
