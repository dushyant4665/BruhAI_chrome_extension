import { config } from 'dotenv';
config();
import OpenAI from 'openai';
import { config } from 'dotenv';

config({ path: './.env' }); 

export default class OpenAIService {
  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('❌ OPENAI_API_KEY is missing from environment variables');
    }

    this.openai = new OpenAI({ apiKey });
  }

  async generateContent(prompt, text) {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: text }
        ],
        temperature: 0.7
      });

      return {
        success: true,
        text: response.choices[0].message.content,
        model: 'gpt-3.5-turbo',
        tokens: response.usage.total_tokens
      };
    } catch (error) {
      console.error("❌ OpenAI API Error:", error.message);
      throw error;
    }
  }
}
