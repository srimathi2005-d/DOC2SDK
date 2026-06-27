import { askAI } from './aiService.js';
import { buildAnalysisPrompt } from '../prompts/analysisPrompt.js';

export async function analyzeApiDocs(scrapedContent, url, useCase) {
  const prompt = buildAnalysisPrompt(scrapedContent, url, useCase);
  const analysisData = await askAI(prompt);
  return analysisData;
}
