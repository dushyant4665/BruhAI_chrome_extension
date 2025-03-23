
import { GoogleGenerativeAI } from '@google/generative-ai';

export default class GeminiService {  
  constructor(apiKey) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async generateContent(prompt, text) {
    try {
      const result = await this.model.generateContent(`${prompt}\n\n${text}`);
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
}