const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  load: { type: mongoose.Schema.Types.ObjectId, ref: 'Load', required: true },
  truck: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck', required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['assigned', 'in-transit', 'delivered'], default: 'assigned' },
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  amount: { type: Number, default: 0 },
  gstAmount: { type: Number, default: 0 },
  from: String,
  to: String
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);