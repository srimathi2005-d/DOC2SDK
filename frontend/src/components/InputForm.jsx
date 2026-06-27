import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript / Node.js' },
  { value: 'python',     label: 'Python' },
  { value: 'java',       label: 'Java' },
];

export default function InputForm({ onSubmit, loading }) {
  const [url,      setUrl]      = useState('');
  const [useCase,  setUseCase]  = useState('');
  const [language, setLanguage] = useState('javascript');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ url, useCase, language });
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.7rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#b0a898',
    marginBottom: '0.5rem',
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ padding: '1.5rem' }}>
      {/* Gold top accent line */}
      <div style={{ height: '2px', background: 'linear-gradient(90deg, #c9a84c, transparent)', marginBottom: '1.5rem', borderRadius: '1px' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* URL */}
        <div>
          <label style={labelStyle}>Documentation URL *</label>
          <input
            type="url"
            required
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://stripe.com/docs/api"
            className="input-base"
          />
        </div>

        {/* Use Case */}
        <div>
          <label style={labelStyle}>
            Intended Use Case
            <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#666660', marginLeft: '0.4rem' }}>
              (optional)
            </span>
          </label>
          <textarea
            rows={3}
            value={useCase}
            onChange={e => setUseCase(e.target.value)}
            placeholder="e.g. I need to create payments and handle refunds."
            className="input-base"
            style={{ resize: 'none' }}
          />
        </div>

        {/* Language */}
        <div>
          <label style={labelStyle}>Target Language</label>
          <div style={{ position: 'relative' }}>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="input-base"
              style={{ appearance: 'none', paddingRight: '2rem', cursor: 'pointer' }}
            >
              {LANGUAGES.map(l => (
                <option key={l.value} value={l.value}
                  style={{ backgroundColor: '#0b1610', color: '#ede5d0' }}>
                  {l.label}
                </option>
              ))}
            </select>
            <svg
              style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#666660' }}
              width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !url}
          className="btn-primary"
          style={{ justifyContent: 'center', width: '100%', padding: '0.65rem' }}
        >
          {loading ? (
            <>
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25"/>
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity="0.75"/>
              </svg>
              Analyzing...
            </>
          ) : (
            <>
              <ArrowRight size={14} />
              Generate SDK
            </>
          )}
        </button>
      </div>
    </form>
  );
}
