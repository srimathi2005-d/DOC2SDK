import { getGeminiClient } from '../config/geminiConfig.js';
import { extractJsonFromMarkdown } from '../utils/formatter.js';

export async function askGemini(prompt) {
  const ai = getGeminiClient();

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      }
    });

    const text = response.text();
    return extractJsonFromMarkdown(text);
  } catch (error) {
    console.error('Gemini Service Error:', error);
    throw new Error(`Failed to communicate with Gemini: ${error.message}`);
  }
}
