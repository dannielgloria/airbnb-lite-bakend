const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    listingId: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true, index: true },
    guestId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    nights: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["CONFIRMED", "CANCELLED"], default: "CONFIRMED", index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
