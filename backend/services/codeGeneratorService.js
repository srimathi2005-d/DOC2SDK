import { askGemini } from './geminiService.js';
import { buildCodePrompt } from '../prompts/codePrompt.js';

export async function generateWrapperCode(apiData, language, useCase) {
  const prompt = buildCodePrompt(apiData, language, useCase);
  const generationData = await askGemini(prompt);
  return generationData;
}
