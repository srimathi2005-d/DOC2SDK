export function extractJsonFromMarkdown(text) {
  // Utility to cleanly parse JSON if Gemini returns markdown fences
  const match = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
  if (match) {
    return JSON.parse(match[1]);
  }
  return JSON.parse(text);
}
