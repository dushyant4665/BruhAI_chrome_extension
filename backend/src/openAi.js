import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function processWithOpenAI(text, prompt) {
  try {
    const response = await openai.chat.completions.create({
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
    error.code = 'OPENAI_ERROR';
    throw error;
  }
}