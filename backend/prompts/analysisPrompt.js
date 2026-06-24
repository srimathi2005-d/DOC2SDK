export function buildAnalysisPrompt(scrapedContent, url, useCase) {
  return `
You are an expert API Integration Architect.
I am providing you with the text scraped from an API documentation URL: ${url}.

My Intended Use Case: ${useCase || 'General usage'}

Please analyze the documentation and return a JSON object STRICTLY matching the following schema. Do NOT wrap the JSON in markdown blocks like \`\`\`json. Just return the raw JSON object.

{
  "baseUrl": "The base URL of the API, if found",
  "authentication": "Description of the auth method (e.g., Bearer Token, API Key in Header)",
  "endpoints": [
    {
      "method": "HTTP method",
      "path": "Endpoint path",
      "purpose": "Brief description of what it does based on the use case"
    }
  ]
}

--- SCRAPED DOCUMENTATION TEXT ---
${scrapedContent}
`;
}
