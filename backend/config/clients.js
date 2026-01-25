const twilio = require('twilio');
const redis = require('redis');
require('dotenv').config();

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const redisClient = redis.createClient({ url: process.env.REDIS_URL });

redisClient.on('error', err => console.error('Redis Client Error:', err));
redisClient.on('connect', () => console.log('Redis Client Connecting...'));
redisClient.on('ready', () => console.log('Redis Client Ready'));
redisClient.on('reconnecting', () => console.log('Redis Client Reconnecting...'));

(async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (err) {
    console.error("Initial Redis connection failed. App will continue in degraded mode.", err);
  }
})();

module.exports = { twilioClient, redisClient };