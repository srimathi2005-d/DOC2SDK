import { askAIChat } from '../services/aiService.js';

const SYSTEM_PROMPT = `You are an API Integration Assistant.

Use ONLY the following API documentation.

If the answer is not present, clearly say "The documentation does not contain this information."

Provide:
1. Direct Answer
2. Relevant Endpoint
3. Example Request
4. Best Practice`;

export const chatWithDocs = async (req, res) => {
  const { question, apiContext } = req.body;

  if (!question || !apiContext) {
    return res.status(400).json({ error: 'Both question and apiContext are required.' });
  }

  try {
    const systemWithContext = `${SYSTEM_PROMPT}

Documentation:
${apiContext}`;

    const answer = await askAIChat(systemWithContext, question);
    res.json({ answer });

  } catch (error) {
    console.error('Chat Controller Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate response.' });
  }
};
