import { askGemini } from './geminiService.js';
import { buildAnalysisPrompt } from '../prompts/analysisPrompt.js';

export async function analyzeApiDocs(scrapedContent, url, useCase) {
  const prompt = buildAnalysisPrompt(scrapedContent, url, useCase);
  const analysisData = await askGemini(prompt);
  return analysisData;
}
