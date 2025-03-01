// backend/src/routes/api.js
import express from 'express';
import { apiLimiter } from '../middleware/rateLimit.js';
import { GeminiService } from '../ai/gemini.js';
import { OpenAIService } from '../ai/openai.js';
import { Cache } from '../db/models/Cache.js';

const router = express.Router();
const gemini = new GeminiService(process.env.GEMINI_API_KEY);
const openai = new OpenAIService(process.env.OPENAI_API_KEY);

router.post('/process', apiLimiter, async (req, res, next) => {
  try {
    const { text, prompt, model = 'gemini' } = req.body;
    
    if (!text || !prompt) {
      const error = new Error('Missing required fields');
      error.statusCode = 400;
      throw error;
    }

    const cacheKey = `${model}:${hashString(text + prompt)}`;
    const cached = await Cache.findOne({ key: cacheKey });
    
    if (cached) return res.json(cached.value);

    let result;
    switch(model.toLowerCase()) {
      case 'gemini':
        result = await gemini.generateContent(prompt, text);
        break;
      case 'openai':
        result = await openai.generateContent(prompt, text);
        break;
      default:
        const error = new Error('Invalid AI model');
        error.statusCode = 400;
        throw error;
    }

    const cacheEntry = new Cache({
      key: cacheKey,
      value: result,
      expiresAt: new Date(Date.now() + 3600000) // 1 hour
    });
    await cacheEntry.save();

    res.json(result);
  } catch (error) {
    next(error);
  }
});

function hashString(str) {
  return str.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
}

export default router;