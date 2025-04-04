import express from 'express';
import { apiLimiter } from '../middleware/rateLimit.js';
import AIService from '../ai/aiService.js';
import { Cache } from '../db/models/Cache.js';
import crypto from 'crypto';

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
    if (cached) return res.json({ success: true, cached: true, data: cached.value });

    if (!['gemini', 'gpt-4', 'llama'].includes(model)) {
      return res.status(400).json({ error: 'Invalid model name' });
    }

    const result = await ai.generateContent(prompt, text, model);
    await Cache.create({ key: cacheKey, value: result });
    
    res.json({ success: true, cached: false, data: result });
  } catch (error) {
    next(error);
  }
});

function hashString(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

export default router;
console.log("🔹 AIService Instance:", ai instanceof AIService);
console.log(".")
