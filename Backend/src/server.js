import dotenv from 'dotenv';
dotenv.config(); // Environment variables load kar raha hai

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import axios from 'axios';
import apiRouter from './routes/api.js';
import { errorHandler } from './middleware/errorHandler.js';
import logger from './utils/logger.js';
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const PORT = process.env.PORT || 8000;

// **Google Generative AI (Gemini) Setup**
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// **MongoDB Connection**
mongoose.connect(process.env.MONGODB_URI)
  .then(() => logger.info('✅ Connected to MongoDB'))
  .catch(err => logger.error('❌ MongoDB connection error:', err));

// **Middleware**
app.use(cors({
  origin: [
    'https://vigilant-engine-7vvqx7xwjq7g2r4qg.github.dev',
    'chrome-extension://extensionid' // Extension ID yaha update kar
  ],
  methods: ['GET', 'POST']
}));
app.use(express.json());

// **Routes**
app.use('/api/v1', apiRouter);

app.get('/', (req, res) => {
  res.send('✅ Backend is running');
});

// **Health Check**
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// **Ollama Mistral AI Route**
app.post("/api/mistral", async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await axios.post(`${process.env.OLLAMA_API_URL}/api/generate`, {
      model: "mistral",
      prompt
    });
    res.json(response.data);
  } catch (error) {
    console.error("Mistral Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// **Error Handling**
app.use(errorHandler);

// **Environment Variable Logs**
console.log('🔍 Env Variables Loaded:', {
  OpenAI: process.env.OPENAI_API_KEY ? '✅' : '❌',
  Gemini: process.env.GEMINI_API_KEY ? '✅' : '❌',
  Ollama: process.env.OLLAMA_API_URL ? '✅' : '❌'
});

// **Server Start**
const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
});

// **Graceful Shutdown**
process.on('SIGTERM', () => {
  server.close(() => {
    mongoose.connection.close();
    logger.info('⚠️ Server closed');
    process.exit(0);
  });
});

// **Extra Logs**
console.log("✅ Gemini API Key Loaded:", process.env.GEMINI_API_KEY ? "Yes" : "No");
console.log("🌍 Ollama API URL:", process.env.OLLAMA_API_URL || "Not Set");
