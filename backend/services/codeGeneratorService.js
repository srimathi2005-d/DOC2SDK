import { askAI } from './aiService.js';
import { buildCodePrompt } from '../prompts/codePrompt.js';

export async function generateWrapperCode(apiData, language, useCase) {
  const prompt = buildCodePrompt(apiData, language, useCase);
  const generationData = await askAI(prompt);
  return generationData;
}
