import dotenv from 'dotenv';
dotenv.config();

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'llama3-8b-8192',
  'mixtral-8x7b-32768',
];

/**
 * Robustly extracts and parses JSON from AI response text.
 * Handles markdown fences, extra text, and lightly malformed JSON.
 */
function robustJSONParse(text) {
  // 1. Try direct parse
  try { return JSON.parse(text); } catch {}

  // 2. Strip markdown fences and try again
  const stripped = text
    .replace(/^```json\s*/im, '')
    .replace(/^```\s*/im, '')
    .replace(/```\s*$/im, '')
    .trim();
  try { return JSON.parse(stripped); } catch {}

  // 3. Extract first {...} block and try parsing it
  const match = stripped.match(/\{[\s\S]*\}/);
  if (match) {
    try { return JSON.parse(match[0]); } catch {}
  }

  throw new Error('AI returned invalid JSON. Raw response: ' + text.substring(0, 300));
}

export async function askAI(prompt) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    throw new Error('GROQ_API_KEY is not configured. Get a free key at https://console.groq.com');
  }

  let lastError;

  for (const model of GROQ_MODELS) {
    try {
      console.log(`[Groq] Trying model: ${model}`);

      const res = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: [
                'You are an expert API Integration Architect and Software Engineer.',
                'CRITICAL RULES:',
                '1. Always respond with a single valid JSON object only.',
                '2. Do NOT wrap the JSON in markdown code blocks (no ```json or ```).',
                '3. All string values in JSON must be properly escaped.',
                '4. For code in JSON string values: escape newlines as \\n, escape double quotes as \\".',
                '5. Never add any text, explanation, or comments outside the JSON object.',
              ].join(' '),
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.2,
          max_tokens: 4096,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data?.error?.message || JSON.stringify(data);
        const err = new Error(msg);
        err.status = res.status;
        throw err;
      }

      const text = data.choices?.[0]?.message?.content;
      if (!text) throw new Error('No content returned from Groq API.');

      return robustJSONParse(text);

    } catch (err) {
      console.warn(`[Groq] Model "${model}" failed (${err.status || 'ERR'}): ${err.message}`);
      lastError = err;
      if (err.status !== 429 && err.status !== 503) break;
    }
  }

  throw new Error(`Groq API failed. Last error: ${lastError?.message}`);
}
