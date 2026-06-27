export function buildCodePrompt(apiData, language, useCase) {
  return `
You are an expert ${language} Software Engineer specializing in API integrations.
I have extracted the following structured API data from a documentation site.

API Data:
${JSON.stringify(apiData, null, 2)}

My Intended Use Case: ${useCase || 'General usage'}

STEP 1 - DETECT OFFICIAL SDK:
First, check if a well-known official or community SDK exists for this API in ${language}.
Examples of APIs WITH official SDKs:
- GitHub API in Python → PyGithub (pip install PyGithub) → exists: true
- GitHub API in JavaScript → @octokit/rest (npm install @octokit/rest) → exists: true
- Stripe API in Python → stripe (pip install stripe) → exists: true
- Stripe API in JavaScript → stripe (npm install stripe) → exists: true
- Twilio in Python → twilio (pip install twilio) → exists: true
- OpenAI in Python → openai (pip install openai) → exists: true
- AWS in Python → boto3 (pip install boto3) → exists: true
- Slack in JavaScript → @slack/web-api → exists: true
- Firebase in JavaScript → firebase (npm install firebase) → exists: true
If the API base URL or name matches a known public service with an official SDK, set exists to true.
If it is a private/custom/unknown API with no public SDK, set exists to false.

STEP 2 - GENERATE CODE:
Generate wrapper code in ${language} for the detected endpoints.

Return a single valid JSON object with EXACTLY this structure. No markdown, no explanation — just raw JSON:

{
  "sdkRecommendation": {
    "exists": true or false,
    "name": "Exact SDK package name if exists (e.g. PyGithub, @octokit/rest), otherwise 'None'",
    "packageCommand": "Install command if exists (e.g. pip install PyGithub), otherwise 'None'",
    "restLibrary": "Best REST library for ${language} if no SDK (e.g. requests, axios)"
  },
  "wrapperCode": "COMPLETE production-ready ${language} code as a single escaped string. Use \\n for newlines and \\" for quotes.",
  "integrationGuide": "Step-by-step setup guide as a single escaped string. Use \\n for newlines.",
  "filename": "Suggested filename (e.g. github_client.py, ApiClient.js)"
}

IMPORTANT: The wrapperCode must be complete working ${language} code with authentication, endpoint functions, error handling and comments — all as a properly escaped JSON string value.
`;
}
