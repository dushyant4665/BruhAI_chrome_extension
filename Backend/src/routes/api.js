import express from 'express';
import { apiLimiter } from '../middleware/rateLimit.js';
import AIService from '../ai/aiService.js';
import { Cache } from '../db/models/Cache.js';

const router = express.Router();
const ai = new AIService();

router.post('/process', apiLimiter, async (req, res, next) => {
  try {
    const { text, prompt, model = 'gemini' } = req.body;
    
    if (!text || !prompt) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const cacheKey = `${model}:${hashString(text + prompt)}`;
    const cached = await Cache.findOne({ key: cacheKey });
    
    if (cached) return res.json(cached.value);

    const result = await ai.generateContent(prompt, text, model);
    
    await Cache.create({
      key: cacheKey,
      value: result,
      expiresAt: new Date(Date.now() + 3600000) // 1 hour cache
    });

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
console.log("🔹 AIService Instance:", !!ai);
