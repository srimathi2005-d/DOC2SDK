const AGENTS = [
  {
    id: 1,
    icon: '📄',
    title: 'Documentation Extractor Agent',
    role: 'Fetches and parses the raw HTML from the provided API documentation URL using Axios + Cheerio. Strips noise (nav, scripts, ads) and extracts meaningful text content.',
    tag: 'Scraping',
  },
  {
    id: 2,
    icon: '🔐',
    title: 'Authentication Agent',
    role: 'Identifies the authentication mechanism used by the API — API Key, Bearer Token, OAuth 2.0, Basic Auth, or custom schemes. Maps auth to code patterns.',
    tag: 'Security',
  },
  {
    id: 3,
    icon: '🔍',
    title: 'Endpoint Analysis Agent',
    role: 'Discovers all available API endpoints, extracts HTTP methods, path parameters, request body schemas, and response shapes from the documentation content.',
    tag: 'Analysis',
  },
  {
    id: 4,
    icon: '📦',
    title: 'SDK Recommendation Agent',
    role: 'Checks for the existence of official SDK packages on npm / PyPI / Maven. Recommends the best-fit library or decides to generate a custom REST wrapper.',
    tag: 'Intelligence',
  },
  {
    id: 5,
    icon: '⚙️',
    title: 'Wrapper Generation Agent',
    role: 'Writes production-ready, idiomatic wrapper code in the selected language (JavaScript, Python, Java). Implements auth, error handling, and all discovered endpoints.',
    tag: 'Code Gen',
  },
  {
    id: 6,
    icon: '📋',
    title: 'Integration Guide Agent',
    role: 'Generates a step-by-step integration guide with install commands, configuration setup, usage examples, and best practices tailored to the specific API.',
    tag: 'Docs',
  },
];

const TAG_COLORS = {
  Scraping:     { bg: 'rgba(59,130,246,0.1)',   color: '#60a5fa',  border: 'rgba(59,130,246,0.2)'  },
  Security:     { bg: 'rgba(239,68,68,0.1)',    color: '#f87171',  border: 'rgba(239,68,68,0.2)'   },
  Analysis:     { bg: 'rgba(201,168,76,0.1)',   color: '#c9a84c',  border: 'rgba(201,168,76,0.2)'  },
  Intelligence: { bg: 'rgba(168,85,247,0.1)',   color: '#c084fc',  border: 'rgba(168,85,247,0.2)'  },
  'Code Gen':   { bg: 'rgba(34,197,94,0.1)',    color: '#4ade80',  border: 'rgba(34,197,94,0.2)'   },
  Docs:         { bg: 'rgba(251,146,60,0.1)',   color: '#fb923c',  border: 'rgba(251,146,60,0.2)'  },
};

export default function AgentPipeline({ compact = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {AGENTS.map((agent, idx) => {
        const tc = TAG_COLORS[agent.tag];
        return (
          <div key={agent.id}>
            {/* Agent card */}
            <div className="card" style={{
              display: 'flex',
              alignItems: compact ? 'center' : 'flex-start',
              gap: '1rem',
              padding: compact ? '0.75rem 1rem' : '1.25rem 1.5rem',
            }}>
              {/* Step number + icon */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                <div style={{
                  width: '36px', height: '36px',
                  border: '1px solid #1a2e22',
                  borderRadius: '4px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: compact ? '1rem' : '1.25rem',
                  backgroundColor: '#0b1610',
                }}>
                  {agent.icon}
                </div>
                <span style={{ fontSize: '0.6rem', color: '#666660', letterSpacing: '0.06em' }}>
                  {String(idx + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: compact ? '0' : '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ede5d0' }}>
                    {agent.title}
                  </span>
                  <span style={{
                    fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '0.15rem 0.45rem', borderRadius: '2px',
                    background: tc.bg, color: tc.color, border: `1px solid ${tc.border}`,
                  }}>
                    {agent.tag}
                  </span>
                </div>
                {!compact && (
                  <p style={{ fontSize: '0.78rem', color: '#8a8a80', lineHeight: 1.7, margin: 0 }}>
                    {agent.role}
                  </p>
                )}
              </div>
            </div>

            {/* Connector arrow */}
            {idx < AGENTS.length - 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '24px', position: 'relative' }}>
                <div style={{ width: '1px', height: '100%', background: '#1a2e22', position: 'absolute' }} />
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ position: 'relative', zIndex: 1, background: '#0b1610' }}>
                  <path d="M6 1v8M2 7l4 4 4-4" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
