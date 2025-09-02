import mongoose from "mongoose";

// we have to update this modela according to the belpw data 
// amenities
// : 
// ""
// capacity
// : 
// "5000"
// cleaningFee
// : 
// "1000"
// description
// : 
// "sdfasdfsfsad asdfasdf"
// images
// : 
// []
// location
// : 
// "dubai"
// name
// : 
// "Conference Hall"
// weekdayPrice
// : 
// "25000"
// weekendPrice
// : 
// "500000"
// _id
// : 
// null

const venueSchema = new mongoose.Schema(
  // create the model json according to the above data
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true },
    availability: { type: Boolean, default: true },
    weekdayPrice: { type: Number, required: true },
    weekendPrice: { type: Number, required: true },
    cleaningFee: { type: Number, default: 0 },
    description: { type: String },
    amenities: { type: String },
    images: [{ type: String }] // array of image URLs

  },
  // {
  //   ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  //   name: { type: String, required: true, trim: true },
  //   address: { type: String, required: true },
  //   capacity: { type: Number, required: true },
  //   availability: { type: Boolean, default: true },
  //   pricePerDay: { type: Number, required: true },
  //   description: { type: String },
  //   rating: { type: Number, default: 0.0 },
  //   images: [{ type: String }] // array of image URLs
  // },
  { timestamps: true }
);

export default mongoose.model("Venue", venueSchema);
