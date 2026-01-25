const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { twilioClient, redisClient } = require('../config/clients');
const User = require('../models/User');
const Tenant = require('../models/Tenant');
const { AppError, ValidationError, AuthError } = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

router.post('/register', asyncHandler(async (req, res, next) => {
  if (!redisClient.isReady) {
    return res.status(503).json({ message: "Registration service temporarily unavailable" });
  }

    const { phone, name, password, role } = req.body;
    
    // Basic Request Validation
    if (!phone || !name || !password || !role) {
      return next(new ValidationError("All fields (name, phone, password, role) are required"));
    }

    if (phone.length < 10) {
      return next(new ValidationError("Please enter a valid phone number"));
    }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  
  await redisClient.set(phone, JSON.stringify({ 
    data: { ...req.body, password: hashedPassword }, 
    otp 
  }), { EX: 300 });

  await twilioClient.messages.create({
    body: `Your OTP for Logistics MS is: ${otp}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone
  });

  res.json({ message: "OTP sent to your phone" });
}));

router.post('/verify-otp', asyncHandler(async (req, res, next) => {
  const { phone, otp } = req.body;
  if (!redisClient.isReady) {
    return res.status(503).json({ message: "Verification service temporarily unavailable" });
  }

  const recordStr = await redisClient.get(phone);
  if (!recordStr) return res.status(400).json({ message: "Invalid or expired OTP" });

  const record = JSON.parse(recordStr);
  if (record.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

  const { data } = record;
  let tenantId = data.tenantId;
  if (!tenantId && data.companyName) {
    const newTenant = new Tenant({ name: data.companyName });
    await newTenant.save();
    tenantId = newTenant._id;
  }
  if (!tenantId) return next(new ValidationError("Company Name or Tenant ID is required"));

  const user = new User({ ...data, tenant: tenantId });
  await user.save();
  await redisClient.del(phone);
  res.json({ message: "User registered successfully" });
}));

router.post('/resend-otp', asyncHandler(async (req, res, next) => {
  const { phone } = req.body;
  if (!redisClient.isReady) return res.status(503).json({ message: "Service temporarily unavailable" });

  const recordStr = await redisClient.get(phone);
  if (!recordStr) return res.status(400).json({ message: "No pending registration found" });

  const record = JSON.parse(recordStr);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  record.otp = otp;
  
  await redisClient.set(phone, JSON.stringify(record), { EX: 300 });
  await twilioClient.messages.create({
    body: `Your new OTP for Logistics MS is: ${otp}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone
  });

  res.json({ message: "New OTP sent" });
}));

router.post('/login', asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ phone: req.body.phone });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new AuthError("Invalid credentials"));
  }
  const accessToken = jwt.sign({ id: user._id, role: user.role, tenantId: user.tenant }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user._id, role: user.role, tenantId: user.tenant }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  user.refreshToken = refreshToken;
  await user.save();
  res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false }).json({ accessToken, role: user.role });
}));

router.post('/refresh', asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);
  const user = await User.findOne({ refreshToken: token });
  if (!user) return res.sendStatus(403);
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    const accessToken = jwt.sign({ id: user._id, role: user.role, tenantId: user.tenant }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    res.json({ accessToken });
  });
}));

router.post('/forgot-password', asyncHandler(async (req, res, next) => {
  const { phone } = req.body;
  if (!phone) return next(new ValidationError("Phone number is required"));

  const user = await User.findOne({ phone });
  if (!user) return next(new AppError("No user found with this phone number", 404));

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store OTP in Redis with a 'reset:' prefix for 5 minutes
  await redisClient.set(`reset:${phone}`, otp, { EX: 300 });

  await twilioClient.messages.create({
    body: `Your password reset OTP for Logistics MS is: ${otp}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone
  });

  res.json({ message: "Reset OTP sent to your phone" });
}));

router.post('/reset-password', asyncHandler(async (req, res, next) => {
  const { phone, otp, newPassword } = req.body;
  if (!phone || !otp || !newPassword) return next(new ValidationError("All fields are required"));

  const storedOtp = await redisClient.get(`reset:${phone}`);
  if (!storedOtp || storedOtp !== otp) {
    return next(new ValidationError("Invalid or expired OTP"));
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await User.findOneAndUpdate({ phone }, { password: hashedPassword });
  await redisClient.del(`reset:${phone}`);

  res.json({ message: "Password reset successfully" });
}));

module.exports = router;