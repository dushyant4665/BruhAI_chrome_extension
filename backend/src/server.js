
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { processWithGemini } from './gemini.js';
import { processWithOpenAI } from './openai.js';
import { Cache } from './models/cache.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(morgan('tiny'));

const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW || 3600 * 1000,
  max: process.env.RATE_LIMIT_MAX || 100,
  message: 'Too many requests, please try again later'
});
app.use(limiter);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

app.get('/health', (req, res) => res.json({ 
  status: 'ok',
  dbState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
}));

app.post('/api/v1/process', async (req, res) => {
  try {
    const { text, prompt, model = 'gemini' } = req.body;
    
    if (!text || !prompt) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const cacheKey = `ai:${model}:${hashString(text + prompt)}`;
    
    const cached = await Cache.findOne({ key: cacheKey });
    if (cached) {
      return res.json(cached.value);
    }

    let result;
    switch(model.toLowerCase()) {
      case 'gemini':
        result = await processWithGemini(text, prompt);
        break;
      case 'openai':
        result = await processWithOpenAI(text, prompt);
        break;
      default:
        return res.status(400).json({ error: 'Invalid model' });
    }

    const cacheEntry = new Cache({
      key: cacheKey,
      value: result,
      expiresAt: new Date(Date.now() + 3600 * 1000)
    });
    await cacheEntry.save();

    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: error.message || 'Processing failed',
      code: error.code
    });
  }
});

function hashString(str) {
  return str.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
}

app.use((err, req, res, next) => {
  res.status(500).json({
    error: 'Internal server error',
    requestId: req.id
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
