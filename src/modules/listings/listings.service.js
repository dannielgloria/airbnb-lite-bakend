const Listing = require('./listing.model');
const ApiError = require('../../utils/ApiError');

const createListing = async (hostId, payload) => {
    const { title, description, address, pricePerNight, maxGuests, amenities } = payload;

    if (!title || !description || !address ) throw new ApiError(400, 'Missing required fields');

    if (pricePerNight == null || pricePerNight <= 0 || maxGuests == null || maxGuests <= 0) throw new ApiError(400, 'Price per night and max guests must be required and greater than 0');
    
    const listing = await Listing.create({
        hostId,
        title,
        description,
        address,
        pricePerNight,
        maxGuests,
        amenities: Array.isArray(amenities) ? amenities : [],
    });

    return listing;
};

const getListings = async (query) => {
    const { search, minPrice, maxPrice, guests } = query;

    const filter = { isActive: true };
    
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { address: { $regex: search, $options: 'i' } },
        ];
    }

    if (minPrice != null || maxPrice != null) {
        filter.pricePerNight = {};
        if (minPrice != null) filter.pricePerNight.$gte = Number(minPrice);
        if (maxPrice != null) filter.pricePerNight.$lte = Number(maxPrice);
    }

    if (guests != null) {
        filter.maxGuests = { $gte: Number(guests) };
    }

    const listings = await Listing.find(filter).sort({ createdAt: -1 });

    return listings;
}

const getListingById = async (id) => {
    const listing = await Listing.findById(id);
    if (!listing || !listing.isActive) throw new ApiError(404, 'Listing not found');
    return listing;
}

const updateListing = async (hostId, id, payload) => {
    const listing = await Listing.findById(id);
    if (!listing || !listing.isActive) throw new ApiError(404, 'Listing not found');
    if (listing.hostId.toString() !== hostId) throw new ApiError(403, 'Forbidden');
    
    const allowed = ['title', 'description', 'address', 'pricePerNight', 'maxGuests', 'amenities', 'isActive'];
    for (const key of Object.keys(payload)) {
        if (allowed.includes(key)) listing[key] = payload[key];
    }

    await listing.save();
    return listing;
}

const deleteListing = async (hostId, id) => {
    const listing = await Listing.findById(id);
    if (!listing || !listing.isActive) throw new ApiError(404, "Listing not found");
    if (String(listing.hostId) !== String(hostId)) throw new ApiError(403, "Forbidden");

    listing.isActive = false;
    await listing.save();
    return { ok: true };
}

const addPhoto = async (hostId, id, photosMeta) => {
    const listing = await Listing.findById(id);
    if (!listing || !listing.isActive) throw new ApiError(404, "Listing not found");
    if (String(listing.hostId) !== String(hostId)) throw new ApiError(403, "Forbidden");

    if (!Array.isArray(photosMeta) || photosMeta.length === 0) throw new ApiError(400, "No photos provided");
    
    const total = listing.photos.length + photosMeta.length;
    if (total > 5) throw new ApiError(400, "Exceeds maximum of 5 photos per listing");

    listing.photos.push(...photosMeta);
    await listing.save();
    return listing;
}

module.exports = {
    createListing,
    getListings,
    getListingById,
    updateListing,
    deleteListing,
    addPhoto,
};