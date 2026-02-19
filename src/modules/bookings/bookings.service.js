const Booking = require("./booking.model");
const Listing = require("../listings/listing.model");
const ApiError = require('../../utils/ApiError');

function diffNights(start, end) {
  const ms = end.getTime() - start.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

async function createBooking(guestId, { listingId, startDate, endDate }) {
  if (!listingId || !startDate || !endDate) throw new ApiError(400, "listingId, startDate, endDate are required");

  const listing = await Listing.findById(listingId);
  if (!listing || !listing.isActive) throw new ApiError(404, "Listing not found");
  if (String(listing.hostId) === String(guestId)) throw new ApiError(400, "Host cannot book own listing");

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) throw new ApiError(400, "Invalid dates");
  if (end <= start) throw new ApiError(400, "endDate must be after startDate");

  const nights = diffNights(start, end);
  if (nights < 1) throw new ApiError(400, "Invalid nights");

  // anti-traslape: si existe booking confirmado que se empalme
  const overlap = await Booking.findOne({
    listingId,
    status: "CONFIRMED",
    $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
  });

  if (overlap) throw new ApiError(409, "Listing is not available for those dates");

  const totalPrice = nights * listing.pricePerNight;

  const booking = await Booking.create({
    listingId,
    guestId,
    startDate: start,
    endDate: end,
    nights,
    totalPrice,
    status: "CONFIRMED",
  });

  return booking;
}

async function myBookings(guestId) {
  return Booking.find({ guestId }).sort({ createdAt: -1 }).populate("listingId");
}

async function cancelBooking(guestId, bookingId) {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new ApiError(404, "Booking not found");
  if (String(booking.guestId) !== String(guestId)) throw new ApiError(403, "Forbidden");
  if (booking.status === "CANCELLED") return booking;

  booking.status = "CANCELLED";
  await booking.save();
  return booking;
}

async function hostBookings(hostId) {
  // bookings de listings donde el hostId es el dueño
  const listings = await Listing.find({ hostId }).select("_id");
  const listingIds = listings.map((l) => l._id);

  return Booking.find({ listingId: { $in: listingIds } })
    .sort({ createdAt: -1 })
    .populate("listingId")
    .populate("guestId", "_id email name");
}

module.exports = { createBooking, myBookings, cancelBooking, hostBookings };
