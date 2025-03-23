import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from 'dotenv';

config({ path: './.env' });

export default class AIService {
  constructor() {
    console.log("🔹 Initializing AI Service...");
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log("🔹 genAI Instance:", !!this.genAI);
  }

  async generateContent(prompt, text, model = "gemini") {
    console.log("🔹 AI Service Called - Model:", model);

    try {
        model = model.toLowerCase();  // ✅ Model name lowercase me convert kar raha hai

        // ✅ Gemini Model
        if (model === "gemini" && this.genAI) {
            console.log("✅ Using Gemini Model");
            return await this._generateWithGemini(prompt, text);
        } 
        // ✅ Mistral Model (Ollama)
        else if (model === "mistral" || model === "mistral:latest") {  
            console.log("✅ Using Ollama Model (Mistral)");
            return await this._generateWithOllama(prompt, text, "mistral");
        }
        // ✅ Llama2 Model (Ollama)
        else if (model === "llama2" || model === "llama2:latest") {  
            console.log("✅ Using Ollama Model (Llama2)");
            return await this._generateWithOllama(prompt, text, "llama2");  // ✅ Fix: Model name change
        } 
        // ❌ Invalid Model
        else {
            console.error("❌ Invalid Model:", model);
            throw new Error(`Invalid or unsupported AI model: ${model}`);
        }
    } catch (error) {
        console.error("❌ AI Error:", error.message);
        return { success: false, error: { code: "AI_ERROR", message: error.message } };
    }
}

  async _generateWithGemini(prompt, text) {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(`${prompt}\n\n${text}`);
    const response = await result.response;

    return {
      success: true,
      text: response.candidates?.[0]?.content?.parts?.[0]?.text || "No response",
      model: 'gemini-pro',
      tokens: response.usageMetadata?.totalTokenCount || 0
    };
  }

  async _generateWithOllama(prompt, text, model) {
    try {
        console.log(`🚀 Fetching response from Ollama (${model})...`);

        const response = await fetch(`${process.env.OLLAMA_API_URL}/api/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: model,  // ✅ Correct model name pass karega
                prompt: prompt,
                stream: false
            })
        });

        const data = await response.json();

        if (!data.response) {
            throw new Error("No response from Ollama");
        }

        return {
            success: true,
            text: data.response,
            model: model,
            tokens: 0
        };
    } catch (error) {
        console.error("❌ Ollama API Error:", error.message);
        throw error;
    }
}

}
