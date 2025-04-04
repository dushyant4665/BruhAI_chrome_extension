import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

export const apiLimiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW || 15 * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX || 100,
  message: 'Too many requests, try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});