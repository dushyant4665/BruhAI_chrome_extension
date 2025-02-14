import express from 'express';
import { processWithGemini } from './gemini.js';
import { processWithOpenAI } from './openai.js';

const app = express();
app.use(express.json());

app.post('/api/process', async (req, res) => {
  try {
    const { text, prompt, model } = req.body;
    
    let result;
    switch(model) {
      case 'gemini':
        result = await processWithGemini(text, prompt);
        break;
      case 'gpt':
        result = await processWithOpenAI(text, prompt);
        break;
      default:
        throw new Error('Invalid AI model');
    }

    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));