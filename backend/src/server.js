// backend/src/server.js
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import { processWithGemini } from './gemini.js';
import { processWithOpenAI } from './openai.js';
import { redisClient } from './cache.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(morgan('tiny'));

// Rate limiting (100 requests/hour)
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after an hour'
});
app.use(limiter);

// Health Check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// AI Processing Endpoint
app.post('/api/v1/process', async (req, res) => {
  try {
    const { text, prompt, model = 'gemini' } = req.body;
    
    // Input validation
    if (!text || !prompt) {
      return res.status(400).json({ error: 'Missing required fields: text and prompt' });
    }

    // Check cache first
    const cacheKey = `ai:${model}:${hash(text + prompt)}`;
    const cached = await redisClient.get(cacheKey);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // Process with selected AI
    let result;
    switch(model.toLowerCase()) {
      case 'gemini':
        result = await processWithGemini(text, prompt);
        break;
      case 'openai':
        result = await processWithOpenAI(text, prompt);
        break;
      default:
        return res.status(400).json({ error: 'Invalid AI model specified' });
    }

    // Cache result for 1 hour
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(result));
    
    res.json(result);
  } catch (error) {
    console.error('Processing error:', error);
    res.status(500).json({ 
      error: error.message || 'AI processing failed',
      code: error.code || 'INTERNAL_ERROR'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({
    error: 'Internal server error',
    requestId: req.headers['x-request-id']
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));