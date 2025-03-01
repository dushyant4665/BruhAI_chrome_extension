// backend/src/server.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import apiRouter from './routes/api.js';
import { errorHandler } from './middleware/errorHandler.js';
import logger from './utils/logger.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 6000;

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => logger.info('Connected to MongoDB'))
  .catch(err => logger.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1', apiRouter);

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Error Handling
app.use(errorHandler);

// Server
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    mongoose.connection.close();
    logger.info('Server closed');
    process.exit(0);
  });
});