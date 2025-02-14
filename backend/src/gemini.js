import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function processWithGemini(text, prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const fullPrompt = `${prompt}\n\n${text}`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    
    return {
      success: true,
      text: response.text(),
      model: 'gemini-pro',
      tokens: response.usageMetadata?.totalTokenCount || 0
    };
  } catch (error) {
    error.code = 'GEMINI_ERROR';
    throw error;
  }
}