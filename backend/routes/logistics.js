const express = require('express');
const router = express.Router();
const Load = require('../models/Load');
const Truck = require('../models/Truck');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { verifyToken, authorize } = require('../middleware/auth');
const { scopeTenant } = require('../middleware/tenant');
const { generateBiltyPDF, generateInvoicePDF } = require('../utils/pdfGenerator');
const asyncHandler = require('../utils/asyncHandler');

router.get('/users', verifyToken, scopeTenant, authorize(['admin']), asyncHandler(async (req, res) => {
  const users = await User.find({ tenant: req.tenantId }).select('-password -refreshToken');
  res.json(users);
}));

router.post('/load/post', verifyToken, scopeTenant, authorize(['customer', 'admin']), asyncHandler(async (req, res) => {
  const load = new Load({ ...req.body, customer: req.user.id, tenant: req.tenantId });
  await load.save();
  res.json(load);
}));

router.get('/load/available', verifyToken, scopeTenant, authorize(['admin']), asyncHandler(async (req, res) => {
  const loads = await Load.find({ tenant: req.tenantId, status: 'pending' });
  res.json(loads);
}));

router.post('/truck/post', verifyToken, scopeTenant, authorize(['driver']), asyncHandler(async (req, res) => {
  const truck = new Truck({ ...req.body, driver: req.user.id, tenant: req.tenantId });
  await truck.save();
  res.json(truck);
}));

router.get('/match/:loadId', verifyToken, scopeTenant, authorize(['admin']), asyncHandler(async (req, res) => {
  const load = await Load.findOne({ _id: req.params.loadId, tenant: req.tenantId });
  const trucks = await Truck.find({
    tenant: req.tenantId,
    capacity: { $gte: load.requiredCapacity },
    isAvailable: true
  });
  res.json(trucks);
}));

router.post('/booking/create', verifyToken, scopeTenant, authorize(['admin']), asyncHandler(async (req, res) => {
  const { loadId, truckId } = req.body;
  const load = await Load.findOneAndUpdate({ _id: loadId, tenant: req.tenantId }, { status: 'matched' });
  const truck = await Truck.findOneAndUpdate({ _id: truckId, tenant: req.tenantId }, { isAvailable: false });
  const booking = new Booking({
    tenant: req.tenantId,
    load: loadId, truck: truckId, driver: truck.driver, customer: load.customer,
    from: load.from, to: load.to, amount: 10000, gstAmount: 1200
  });
  await booking.save();
  res.json(booking);
}));

router.get('/booking/all', verifyToken, authorize(['admin']), asyncHandler(async (req, res) => {
  res.json(await Booking.find().populate('load truck'));
}));

router.get('/customer/bookings', verifyToken, authorize(['customer']), asyncHandler(async (req, res) => {
  res.json(await Booking.find({ customer: req.user.id }).populate('load truck'));
}));

router.post('/booking/:id/payment', verifyToken, authorize(['admin']), asyncHandler(async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(req.params.id, { paymentStatus: 'paid' }, { new: true });
  res.json(booking);
}));

router.get('/driver/bookings', verifyToken, authorize(['driver']), asyncHandler(async (req, res) => {
  res.json(await Booking.find({ driver: req.user.id }));
}));

router.patch('/booking/:id/status', verifyToken, asyncHandler(async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(booking);
}));

router.get('/booking/:id/bilty', verifyToken, asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('load truck');
  res.setHeader('Content-Type', 'application/pdf');
  generateBiltyPDF(booking, res);
}));

router.get('/booking/:id/invoice', verifyToken, asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('customer');
  res.setHeader('Content-Type', 'application/pdf');
  generateInvoicePDF(booking, res);
}));

module.exports = router;