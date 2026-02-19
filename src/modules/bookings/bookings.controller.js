const service = require("./bookings.service");

async function create(req, res) {
  const data = await service.createBooking(req.user.sub, req.body);
  res.status(201).json(data);
}

async function mine(req, res) {
  const data = await service.myBookings(req.user.sub);
  res.json(data);
}

async function cancel(req, res) {
  const data = await service.cancelBooking(req.user.sub, req.params.id);
  res.json(data);
}

async function host(req, res) {
  const data = await service.hostBookings(req.user.sub);
  res.json(data);
}

module.exports = { create, mine, cancel, host };
