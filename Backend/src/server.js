import dotenv from 'dotenv';
dotenv.config(); // ✅ Load .env first

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import axios from 'axios';
import apiRouter from './routes/api.js';
import { errorHandler } from './middleware/errorHandler.js';
import logger from './utils/logger.js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { apiLimiter } from './middleware/rateLimit.js';
import { Cache } from './db/models/Cache.js';
import crypto from 'crypto';

const app = express();
const PORT = process.env.PORT || 8000;

// ✅ Middleware Setup
const allowedOrigins = ["http://localhost:5174", "http://127.0.0.1:5500"];

app.use(express.json()); // Ensure body parsing is available first
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS Not Allowed"));
    }
  },
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(apiLimiter);

// ✅ Google Generative AI (Gemini) Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log("🔹 AIService Instance:", genAI instanceof GoogleGenerativeAI);

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => logger.info('✅ Connected to MongoDB'))
  .catch(err => logger.error('❌ MongoDB connection error:', err));

// ✅ Routes
app.use('/api/v1', apiRouter);

app.get('/', (req, res) => {
  res.send('✅ Backend is running ');
});

// ✅ Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// ✅ Ollama Mistral AI Route
// app.post("/api/mistral", async (req, res) => {
//   console.log("🔍 Received request body:", req.body); // Debugging

//   try {
//     const { model, prompt, stream } = req.body;

//     if (!model || !prompt) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const response = await axios.post(`${process.env.OLLAMA_API_URL}/api/generate`, {
//       model,
//       prompt,
//       stream: stream || false
//     });

//     res.json(response.data);
//   } catch (error) {
//     console.error("❌ Mistral Error:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

app.post("/api/mistral", async (req, res) => {
  console.log("🔍 Received request body:", req.body); // Debugging

  try {
    const { model, prompt, stream } = req.body;

    if (!model || !prompt) {  // ✅ Ensure required fields are present
      return res.status(400).json({ error: "Missing required fields" });
    }

    const response = await axios.post(`${process.env.OLLAMA_API_URL}/api/generate`, {
      model,
      prompt,
      stream: stream || false
    });

    res.json(response.data);
  } catch (error) {
    console.error("❌ Mistral Error:", error);
    res.status(500).json({ error: error.message });
  }
});


// ✅ Error Handling Middleware
app.use(errorHandler);

// ✅ Environment Variable Logs
console.log('🔍 Env Variables Loaded:', {
  OpenAI: process.env.OPENAI_API_KEY ? '✅' : '❌',
  Gemini: process.env.GEMINI_API_KEY ? '✅' : '❌',
  Ollama: process.env.OLLAMA_API_URL ? '✅' : '❌'
});

// ✅ Server Start
const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
});

// ✅ Graceful Shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    mongoose.connection.close();
    logger.info('⚠️ Server closed');
    process.exit(0);
  });
});

// ✅ Hash Function for Cache Keys
function hashString(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}
