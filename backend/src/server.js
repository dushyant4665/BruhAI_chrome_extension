
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
// import dotenv from 'dotenv';
import apiRouter from './routes/api.js';
import { errorHandler } from './middleware/errorHandler.js';
import logger from './utils/logger.js';


const app = express();
const PORT = process.env.PORT || 6000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => logger.info('Connected to MongoDB'))
  .catch(err => logger.error('MongoDB connection error:', err));

//middleware
app.use(cors());
app.use(express.json());

//routes
app.use('/api/v1', apiRouter);

//health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

//error handling
app.use(errorHandler);

//server
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

//graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    mongoose.connection.close();
    logger.info('Server closed');
    process.exit(0);
  });
});