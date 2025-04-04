import { GoogleGenerativeAI } from '@google/generative-ai';

export default class GeminiService {  
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error("❌ Gemini API Key is required!");
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro' }); 
  }

  async generateContent(prompt, text) {
    try {
      const result = await this.model.generateContent(`${prompt}\n\n${text}`);
      const response = await result.response;

      return {
        success: true,
        text: response.candidates?.[0]?.content?.parts?.[0]?.text || "No response",
        model: 'gemini-pro',
        tokens: response.usageMetadata?.totalTokenCount || 0
      };
    } catch (error) {
      console.error("❌ Gemini API Error:", error.message);
      throw error;
    }
  }
}
