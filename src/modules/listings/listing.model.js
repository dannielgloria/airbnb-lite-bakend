const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
    url: { type: String, required: true },
    publicId: { type: String, required: true },
}
, { _id: false });

const listingSchema = new mongoose.Schema(
    {
        hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        pricePerNight: { type: Number, required: true, min: 0 },
        maxGuests: { type: Number, required: true, min: 1 },
        amenities: { type: [String], default: [] },
        bedrooms: { type: Number, required: true },
        isActive: { type: Boolean, default: true },
        photos: { type: [photoSchema], default: [] },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Listing', listingSchema);