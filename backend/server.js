require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');

// Initialize clients (Redis connection happens here)
require('./config/clients');

const app = express();
app.use(express.json());
app.use(cors({ origin: true, credentials: true })); // origin: true reflects the request origin, allowing any port
app.use(cookieParser());

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not defined in .env file.");
  process.exit(1);
}
mongoose.connect(MONGO_URI).then(() => console.log("MongoDB Connected")).catch(err => console.error("MongoDB connection error:", err));

app.get('/api/health', (req, res) => {
  res.json({ status: "ok", message: "Backend is reachable" });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/logistics'));

// 404 Handler
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Global Error Handler
app.use(errorHandler);

const server = app.listen(5001, () => console.log("Server running on port 5001"));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});