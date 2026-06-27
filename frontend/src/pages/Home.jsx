import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Cpu, Code2, Package, BookOpen, Zap } from 'lucide-react';
import InputForm from '../components/InputForm.jsx';
import { apiService } from '../services/apiService.js';

const FEATURES = [
  { icon: Globe,    title: 'Documentation Scraping', desc: 'Fetches and parses any public API documentation URL.' },
  { icon: Cpu,      title: 'AI-Powered Analysis',    desc: 'Extracts endpoints, auth patterns, and base URLs.' },
  { icon: Code2,    title: 'SDK Generation',          desc: 'Produces idiomatic wrapper code in your chosen language.' },
  { icon: Package,  title: 'SDK Detection',           desc: 'Identifies official packages and install commands.' },
  { icon: BookOpen, title: 'Integration Guide',       desc: 'Step-by-step setup instructions with the generated code.' },
  { icon: Zap,      title: 'Instant Download',        desc: 'Download the generated file ready for your project.' },
];

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const navigate = useNavigate();

  const handleAnalyze = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const apiData = await apiService.analyzeDocs(formData.url, formData.useCase, formData.language);
      navigate('/results', { state: { apiData, reqInfo: formData } });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process documentation. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-14">

      {/* ── Page heading ── */}
      <div className="text-center mb-14">
        {/* Gold rule */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div style={{ height: '1px', width: '60px', backgroundColor: '#c9a84c', opacity: 0.5 }} />
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c' }}>
            API Integration Tool
          </span>
          <div style={{ height: '1px', width: '60px', backgroundColor: '#c9a84c', opacity: 0.5 }} />
        </div>

        <h1 style={{
          fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
          fontWeight: 700,
          color: '#c9a84c',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          marginBottom: '0.75rem',
          lineHeight: 1.2,
        }}>
          Documentation to SDK
        </h1>
        <p style={{ color: '#b0a898', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto', lineHeight: 1.8 }}>
          Paste any API documentation URL. Doc2SDK analyzes the page and generates
          production-ready wrapper code in your chosen language.
        </p>
      </div>

      {/* ── Main layout ── */}
      <div className="grid lg:grid-cols-5 gap-10 items-start mb-16">

        {/* Form */}
        <div className="lg:col-span-2">
          {error && (
            <div style={{
              marginBottom: '1rem',
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '4px',
              color: '#f87171',
              fontSize: '0.8rem',
            }}>
              {error}
            </div>
          )}
          <InputForm onSubmit={handleAnalyze} loading={loading} />

          {/* Test URLs */}
          <div style={{ marginTop: '1.25rem' }}>
            <p style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#666660', marginBottom: '0.6rem' }}>
              Try with
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {[
                'https://docs.github.com/en/rest',
                'https://stripe.com/docs/api',
                'https://jsonplaceholder.typicode.com/',
              ].map(url => (
                <span key={url}
                  style={{ fontSize: '0.72rem', fontFamily: 'JetBrains Mono, monospace', color: '#c9a84c', opacity: 0.7 }}>
                  {url}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="lg:col-span-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-5" style={{ transition: 'border-color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#243a2a'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#1a2e22'}
            >
              <Icon size={14} style={{ color: '#c9a84c', marginBottom: '0.75rem' }} strokeWidth={1.5} />
              <h3 style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ede5d0', marginBottom: '0.35rem', letterSpacing: '0.02em' }}>
                {title}
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#8a8a80', lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom rule ── */}
      <div style={{ borderTop: '1px solid #1a2e22', paddingTop: '1.5rem' }}>
        <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#666660', letterSpacing: '0.04em' }}>
          Works with any publicly accessible API documentation — REST APIs, third-party services, or custom endpoints.
        </p>
      </div>

    </div>
  );
}
