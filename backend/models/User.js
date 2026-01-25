const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  name: { type: String, required: true },
  phone: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: function(v) {
        return /^\+?[1-9]\d{1,14}$/.test(v); // E.164 format validation
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'driver', 'admin'], default: 'customer' },
  refreshToken: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);