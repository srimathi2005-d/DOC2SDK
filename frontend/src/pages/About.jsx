import { useNavigate } from 'react-router-dom';
import {
  Globe, Cpu, Code2, Package, BookOpen, Zap, Download,
  ArrowRight, CheckCircle, Clock, Users, Layers,
} from 'lucide-react';
import AgentPipeline from '../components/AgentPipeline.jsx';

/* ── Data ───────────────────────────────────────────── */

const PROBLEMS = [
  { icon: '📚', title: 'Lengthy Documentation',   desc: 'Developers spend hours reading hundreds of pages just to understand what endpoints exist and how to call them.' },
  { icon: '🔐', title: 'Auth Complexity',          desc: 'OAuth 2.0, API keys, JWT tokens, HMAC signatures — each API has a different authentication puzzle to solve.' },
  { icon: '🔍', title: 'Endpoint Discovery',       desc: 'Finding the relevant routes among dozens of endpoints, parameters, and deprecated paths wastes critical development time.' },
  { icon: '⌨️', title: 'Boilerplate Code',         desc: 'Writing the same repetitive HTTP client wrappers, error handlers, and retry logic for every new API integration.' },
  { icon: '📦', title: 'SDK Learning Curve',       desc: 'Each third-party SDK has its own conventions, patterns, and quirks that take time to learn before writing a single line of business logic.' },
];

const FEATURES = [
  { icon: Globe,    title: 'Documentation Analysis',   desc: 'Fetches and intelligently parses any publicly accessible API documentation URL using Axios + Cheerio.' },
  { icon: '🔐',     title: 'Auth Detection',            desc: 'Automatically identifies authentication schemes: API Key, Bearer, OAuth 2.0, Basic Auth, and more.' },
  { icon: '🔍',     title: 'Endpoint Discovery',        desc: 'Extracts all endpoints, HTTP methods, parameters, and response schemas from the documentation.' },
  { icon: Package,  title: 'SDK Recommendation',        desc: 'Checks npm, PyPI, Maven for official SDKs and recommends the best package or generates a custom wrapper.' },
  { icon: Code2,    title: 'Wrapper Code Generation',   desc: 'Produces production-ready, idiomatic wrapper code in JavaScript, Python, or Java with full auth integration.' },
  { icon: BookOpen, title: 'Integration Guide',         desc: 'Generates a step-by-step integration guide with install commands, config setup, and usage examples.' },
  { icon: Download, title: 'Downloadable SDK',          desc: 'Download the generated file directly or export a complete SDK project as a ZIP archive.' },
];

const TECH = [
  {
    category: 'Frontend',
    color: '#60a5fa',
    items: ['React.js', 'Vite', 'Tailwind CSS', 'React Router', 'Lucide Icons'],
  },
  {
    category: 'Backend',
    color: '#4ade80',
    items: ['Node.js', 'Express.js', 'CORS', 'dotenv', 'ES Modules'],
  },
  {
    category: 'AI / LLM',
    color: '#c9a84c',
    items: ['Groq API', 'Llama 3.3 70B', 'Prompt Engineering', 'RAG (Chat)', 'JSON Mode'],
  },
  {
    category: 'Processing',
    color: '#fb923c',
    items: ['Axios (HTTP)', 'Cheerio (HTML)', 'JSZip (Archive)', 'react-syntax-highlighter'],
  },
];

const STATS = [
  { value: '~2min', label: 'Integration Time',     sub: 'vs hours manually',   icon: Clock,  color: '#c9a84c' },
  { value: '3+',    label: 'Languages Supported',  sub: 'JS · Python · Java',  icon: Code2,  color: '#60a5fa' },
  { value: '100%',  label: 'Automated Workflow',   sub: 'scrape → analyze → generate', icon: Cpu, color: '#4ade80' },
  { value: '∞',     label: 'APIs Supported',       sub: 'any public REST API', icon: Globe,  color: '#fb923c' },
];

const ROADMAP = [
  { quarter: 'Q3 2025', status: 'done',     title: 'Core SDK Generation',      desc: 'Documentation analysis + code generation for JS, Python, Java.' },
  { quarter: 'Q4 2025', status: 'done',     title: 'Multi-Agent Architecture', desc: 'Specialized AI agents for auth, endpoint, and SDK tasks.' },
  { quarter: 'Q1 2026', status: 'current',  title: 'AI Documentation Chat',    desc: 'RAG-based chat assistant to query API documentation in natural language.' },
  { quarter: 'Q2 2026', status: 'planned',  title: 'GraphQL Support',          desc: 'Extend generation to GraphQL schemas and subscriptions.' },
  { quarter: 'Q3 2026', status: 'planned',  title: 'Team Workspaces',          desc: 'Shared SDK libraries, version history, and collaborative generation.' },
  { quarter: 'Q4 2026', status: 'planned',  title: 'CI/CD Integration',        desc: 'GitHub Actions + automatic SDK regeneration on documentation changes.' },
];

const STATUS_STYLE = {
  done:    { color: '#4ade80',  label: 'Released' },
  current: { color: '#c9a84c',  label: 'In Progress' },
  planned: { color: '#666660',  label: 'Planned' },
};

/* ── Sub-components ─────────────────────────────────── */

function SectionHeader({ tag, title, sub }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <div style={{ height: '1px', width: '40px', background: '#c9a84c', opacity: 0.4 }} />
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c' }}>{tag}</span>
        <div style={{ height: '1px', width: '40px', background: '#c9a84c', opacity: 0.4 }} />
      </div>
      <h2 style={{ fontSize: 'clamp(1.35rem, 3vw, 1.9rem)', fontWeight: 700, color: '#ede5d0', marginBottom: '0.6rem', letterSpacing: '0.02em' }}>
        {title}
      </h2>
      {sub && <p style={{ fontSize: '0.875rem', color: '#8a8a80', maxWidth: '520px', margin: '0 auto', lineHeight: 1.8 }}>{sub}</p>}
    </div>
  );
}

/* ── Page ───────────────────────────────────────────── */

export default function About() {
  const navigate = useNavigate();

  return (
    <div>

      {/* ═══ HERO ═══ */}
      <section style={{ padding: '5rem 1.5rem 4rem', textAlign: 'center', borderBottom: '1px solid #1a2e22', background: 'linear-gradient(180deg, #0d1d13 0%, #0b1610 100%)' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', padding: '0.3rem 0.9rem', borderRadius: '2px', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
            <span style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c9a84c' }}>
              Powered by Generative AI &amp; Large Language Models
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 800, color: '#c9a84c', letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1.15, marginBottom: '1rem' }}>
            Doc2SDK
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', fontWeight: 300, color: '#ede5d0', marginBottom: '0.75rem', letterSpacing: '0.02em' }}>
            AI-Powered API Integration Copilot
          </p>
          <p style={{ fontSize: '0.9rem', color: '#8a8a80', maxWidth: '540px', margin: '0 auto 2rem', lineHeight: 1.9 }}>
            Paste any API documentation URL. Doc2SDK analyzes the page with specialized AI agents and generates production-ready SDK code in your language of choice — in under 2 minutes.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/')} className="btn-primary" style={{ padding: '0.65rem 1.75rem' }}>
              <ArrowRight size={14} /> Start Generating
            </button>
            <button onClick={() => navigate('/chat')} className="btn-secondary" style={{ padding: '0.65rem 1.75rem' }}>
              Ask Documentation
            </button>
          </div>

          {/* Stat row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', marginTop: '3rem', flexWrap: 'wrap' }}>
            {STATS.map(({ value, label, sub, icon: Icon, color }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '1.6rem', fontWeight: 800, color, fontFamily: 'JetBrains Mono, monospace', marginBottom: '0.15rem' }}>{value}</p>
                <p style={{ fontSize: '0.72rem', fontWeight: 600, color: '#ede5d0', letterSpacing: '0.06em' }}>{label}</p>
                <p style={{ fontSize: '0.65rem', color: '#666660' }}>{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PROBLEM STATEMENT ═══ */}
      <section style={{ padding: '4rem 1.5rem', borderBottom: '1px solid #1a2e22' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <SectionHeader
            tag="The Problem"
            title="API Integration Is Broken"
            sub="Developers waste days reading documentation, deciphering authentication flows, and writing the same boilerplate code over and over again."
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.875rem' }}>
            {PROBLEMS.map(p => (
              <div key={p.title} className="card" style={{ padding: '1.25rem' }}>
                <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.75rem' }}>{p.icon}</span>
                <h3 style={{ fontSize: '0.82rem', fontWeight: 600, color: '#ede5d0', marginBottom: '0.5rem' }}>{p.title}</h3>
                <p style={{ fontSize: '0.75rem', color: '#8a8a80', lineHeight: 1.7 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SOLUTION ═══ */}
      <section style={{ padding: '4rem 1.5rem', borderBottom: '1px solid #1a2e22', background: '#0d1d13' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
          <SectionHeader
            tag="The Solution"
            title="Automate the Entire Integration Workflow"
            sub="Doc2SDK uses a multi-agent LLM architecture to analyze, understand, and generate everything needed to integrate any API — automatically."
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.875rem', textAlign: 'left' }}>
            {[
              { step: '01', text: 'Paste a documentation URL — any publicly accessible REST API docs page' },
              { step: '02', text: 'AI agents analyze the page, extract endpoints, and detect authentication' },
              { step: '03', text: 'Specialized agents check for official SDKs and generate idiomatic wrapper code' },
              { step: '04', text: 'Download production-ready code with a complete integration guide' },
            ].map(({ step, text }) => (
              <div key={step} className="card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'JetBrains Mono, monospace', color: '#c9a84c', flexShrink: 0 }}>{step}</span>
                <p style={{ fontSize: '0.78rem', color: '#b0a898', lineHeight: 1.7 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CORE FEATURES ═══ */}
      <section style={{ padding: '4rem 1.5rem', borderBottom: '1px solid #1a2e22' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <SectionHeader tag="Platform" title="Core Features" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '0.875rem' }}>
            {FEATURES.map(f => (
              <div key={f.title} className="card" style={{ padding: '1.25rem' }}>
                <div style={{ marginBottom: '0.75rem', color: '#c9a84c' }}>
                  {typeof f.icon === 'string'
                    ? <span style={{ fontSize: '1.25rem' }}>{f.icon}</span>
                    : <f.icon size={18} strokeWidth={1.5} />}
                </div>
                <h3 style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ede5d0', marginBottom: '0.4rem' }}>{f.title}</h3>
                <p style={{ fontSize: '0.73rem', color: '#8a8a80', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ AI ARCHITECTURE ═══ */}
      <section style={{ padding: '4rem 1.5rem', borderBottom: '1px solid #1a2e22', background: '#0d1d13' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <SectionHeader
            tag="Architecture"
            title="Multi-Agent AI Pipeline"
            sub="Instead of a single monolithic prompt, Doc2SDK uses six specialized AI agents — each responsible for one step of the integration workflow."
          />
          <AgentPipeline />
        </div>
      </section>

      {/* ═══ TECH STACK ═══ */}
      <section style={{ padding: '4rem 1.5rem', borderBottom: '1px solid #1a2e22' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <SectionHeader tag="Engineering" title="Technology Stack" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.875rem' }}>
            {TECH.map(t => (
              <div key={t.category} className="card" style={{ padding: '1.25rem', borderTop: `2px solid ${t.color}` }}>
                <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: t.color, marginBottom: '0.875rem' }}>
                  {t.category}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {t.items.map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: t.color, flexShrink: 0 }} />
                      <span style={{ fontSize: '0.78rem', color: '#b0a898' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHY DOC2SDK ═══ */}
      <section style={{ padding: '4rem 1.5rem', borderBottom: '1px solid #1a2e22', background: '#0d1d13' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <SectionHeader
            tag="Value"
            title="Why Doc2SDK?"
            sub="Built for engineers who value their time and want to ship faster without sacrificing code quality."
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.875rem' }}>
            {[
              { icon: <Clock size={20} />,  title: '80% Faster Integration',    desc: 'What takes hours of reading and coding is reduced to minutes with AI-powered generation.',      color: '#c9a84c' },
              { icon: <Code2 size={20} />,  title: 'Production-Ready Code',     desc: 'Generated wrappers include error handling, retries, auth, and typed method signatures.',        color: '#60a5fa' },
              { icon: <Cpu size={20} />,    title: 'Zero Boilerplate',           desc: 'Stop writing the same HTTP client setup for every new API. Let AI handle it.',                 color: '#4ade80' },
              { icon: <Users size={20} />,  title: 'Faster Team Onboarding',    desc: 'New developers can understand and use any API immediately without reading documentation.',       color: '#fb923c' },
            ].map(card => (
              <div key={card.title} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ color: card.color, marginBottom: '0.875rem' }}>{card.icon}</div>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ede5d0', marginBottom: '0.5rem' }}>{card.title}</h3>
                <p style={{ fontSize: '0.75rem', color: '#8a8a80', lineHeight: 1.7 }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ROADMAP ═══ */}
      <section style={{ padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <SectionHeader
            tag="Roadmap"
            title="What's Coming Next"
            sub="Doc2SDK is actively developed. Here's what's on the horizon."
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {ROADMAP.map((item, idx) => {
              const st = STATUS_STYLE[item.status];
              return (
                <div key={idx} style={{ display: 'flex', gap: '1.25rem' }}>
                  {/* Timeline spine */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: st.color, marginTop: '0.45rem', border: '2px solid #0b1610', zIndex: 1 }} />
                    {idx < ROADMAP.length - 1 && (
                      <div style={{ width: '1px', flex: 1, background: '#1a2e22', marginTop: '4px', marginBottom: '4px' }} />
                    )}
                  </div>
                  {/* Content */}
                  <div style={{ paddingBottom: '1.5rem', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.65rem', fontFamily: 'JetBrains Mono, monospace', color: '#666660' }}>{item.quarter}</span>
                      <span style={{
                        fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
                        padding: '0.1rem 0.4rem', borderRadius: '2px',
                        background: `${st.color}15`, color: st.color, border: `1px solid ${st.color}30`,
                      }}>{st.label}</span>
                    </div>
                    <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ede5d0', marginBottom: '0.3rem' }}>{item.title}</h3>
                    <p style={{ fontSize: '0.75rem', color: '#8a8a80', lineHeight: 1.7 }}>{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
