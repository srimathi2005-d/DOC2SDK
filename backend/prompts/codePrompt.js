export function buildCodePrompt(apiData, language, useCase) {
  return `
You are an expert ${language} Software Engineer.
I have extracted the following structured API data from a documentation site.

API Data:
${JSON.stringify(apiData, null, 2)}

My Intended Use Case: ${useCase || 'General usage'}

Please generate a JSON object STRICTLY matching the following schema. Do NOT wrap the JSON in markdown blocks like \`\`\`json. Just return the raw JSON object.

{
  "sdkRecommendation": {
    "exists": true/false, // True if there's an official or well-known community SDK for this API in ${language}
    "name": "Name of the SDK (if exists) or 'None'",
    "packageCommand": "npm install pkg / pip install pkg / maven dep (if exists) or 'None'",
    "restLibrary": "If exists=false, recommend a REST library (e.g., axios, requests, okhttp)"
  },
  "wrapperCode": "Write production-ready, idiomatic wrapper code in ${language} that handles authentication and implements the endpoints relevant to the use case. Include comments and basic error handling.",
  "integrationGuide": "Write a short step-by-step bash/text guide on how to set this up, install dependencies, and run a test script.",
  "filename": "Suggested filename for the generated code (e.g., StripeClient.js)"
}
`;
}
