import { useState, useRef, useEffect } from 'react';
import { Send, Plus, Minus, Play, Clock, AlertCircle } from 'lucide-react';

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

const METHOD_COLORS = {
  GET:    '#60a5fa',
  POST:   '#4ade80',
  PUT:    '#fb923c',
  PATCH:  '#fbbf24',
  DELETE: '#f87171',
};

const TABS = ['Request', 'Response', 'Headers', 'Logs'];

function StatusBadge({ code }) {
  const color = code >= 500 ? '#f87171' : code >= 400 ? '#fb923c' : code >= 300 ? '#fbbf24' : '#4ade80';
  return (
    <span style={{ fontSize: '0.72rem', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color, background: `${color}18`, border: `1px solid ${color}30`, padding: '0.15rem 0.5rem', borderRadius: '2px' }}>
      {code}
    </span>
  );
}

function JsonViewer({ data }) {
  if (!data) return null;
  try {
    const str = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    return (
      <pre style={{ margin: 0, fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', color: '#b0a898', overflowX: 'auto', lineHeight: 1.8, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {str}
      </pre>
    );
  } catch {
    return <pre style={{ margin: 0, fontSize: '0.75rem', color: '#f87171' }}>{String(data)}</pre>;
  }
}

export default function Playground() {
  const [method,     setMethod]     = useState('GET');
  const [url,        setUrl]        = useState('');
  const [headers,    setHeaders]    = useState([{ key: 'Content-Type', value: 'application/json' }]);
  const [authType,   setAuthType]   = useState('none');
  const [authValue,  setAuthValue]  = useState('');
  const [body,       setBody]       = useState('');
  const [activeTab,  setActiveTab]  = useState('Request');

  const [response,   setResponse]   = useState(null);
  const [resTime,    setResTime]    = useState(null);
  const [resStatus,  setResStatus]  = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [logs,       setLogs]       = useState([]);

  /* Pre-fill from sessionStorage if available */
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('doc2sdk_apiData');
      if (raw) {
        const data = JSON.parse(raw);
        if (data.baseUrl) setUrl(data.baseUrl);
        if (data.endpoints?.[0]) {
          const ep = data.endpoints[0];
          setMethod((ep.method || 'GET').toUpperCase());
          if (data.baseUrl && ep.path) setUrl(data.baseUrl.replace(/\/$/, '') + ep.path);
        }
      }
    } catch {}
  }, []);

  const addLog = (msg) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const sendRequest = async () => {
    if (!url) return;
    setLoading(true);
    setResponse(null);
    setResStatus(null);
    setResTime(null);
    setActiveTab('Response');

    const start = Date.now();
    addLog(`→ ${method} ${url}`);

    try {
      const reqHeaders = {};
      headers.forEach(h => { if (h.key) reqHeaders[h.key] = h.value; });
      if (authType === 'bearer' && authValue)    reqHeaders['Authorization'] = `Bearer ${authValue}`;
      if (authType === 'apikey' && authValue)    reqHeaders['X-API-Key'] = authValue;
      if (authType === 'basic' && authValue)     reqHeaders['Authorization'] = `Basic ${btoa(authValue)}`;

      addLog(`Headers: ${JSON.stringify(reqHeaders)}`);

      const options = { method, headers: reqHeaders };
      if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
        options.body = body;
        addLog(`Body: ${body.substring(0, 100)}${body.length > 100 ? '...' : ''}`);
      }

      const res = await fetch(url, options);
      const elapsed = Date.now() - start;
      setResTime(elapsed);
      setResStatus(res.status);
      addLog(`← ${res.status} ${res.statusText} (${elapsed}ms)`);

      const contentType = res.headers.get('content-type') || '';
      let responseData;
      if (contentType.includes('application/json')) {
        responseData = await res.json();
      } else {
        responseData = await res.text();
      }
      setResponse(responseData);

    } catch (err) {
      const elapsed = Date.now() - start;
      setResTime(elapsed);
      addLog(`✗ Error: ${err.message}`);
      if (err.message.includes('CORS') || err.message.includes('NetworkError') || err.message.includes('Failed to fetch')) {
        setResponse({ _error: 'CORS_BLOCKED', message: 'Request blocked by CORS policy. The API server does not allow browser-direct requests.', hint: 'This is expected for most production APIs. Use the generated wrapper code (which runs server-side) or enable CORS on your API server.' });
        setResStatus(0);
      } else {
        setResponse({ _error: err.message });
        setResStatus(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateHeader = (idx, field, val) => {
    setHeaders(prev => prev.map((h, i) => i === idx ? { ...h, [field]: val } : h));
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#c9a84c', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
          API Playground
        </h1>
        <p style={{ fontSize: '0.72rem', color: '#8a8a80' }}>
          Interactive API testing environment — pre-filled from your last analysis when available
        </p>
      </div>

      {/* ── URL bar ── */}
      <div className="card" style={{ padding: '0.875rem 1rem', marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Method selector */}
        <div style={{ position: 'relative' }}>
          <select
            value={method}
            onChange={e => setMethod(e.target.value)}
            style={{
              appearance: 'none', padding: '0.4rem 1.5rem 0.4rem 0.6rem',
              background: '#0b1610', border: '1px solid #1a2e22', borderRadius: '2px',
              color: METHOD_COLORS[method], fontSize: '0.75rem', fontWeight: 700,
              fontFamily: 'JetBrains Mono, monospace', cursor: 'pointer', outline: 'none',
            }}
          >
            {METHODS.map(m => <option key={m} value={m} style={{ color: METHOD_COLORS[m] }}>{m}</option>)}
          </select>
          <svg style={{ position: 'absolute', right: '0.35rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#666660' }} width="10" height="10" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>

        {/* URL input */}
        <input
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://api.example.com/v1/endpoint"
          className="input-base"
          style={{ flex: 1, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', minWidth: '200px' }}
          onKeyDown={e => e.key === 'Enter' && sendRequest()}
        />

        {/* Send button */}
        <button
          onClick={sendRequest}
          disabled={loading || !url}
          className="btn-primary"
          style={{ padding: '0.4rem 1rem', fontSize: '0.72rem', flexShrink: 0 }}
        >
          {loading ? (
            <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25"/>
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity="0.75"/>
            </svg>
          ) : <Play size={13} />}
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>

      {/* ── Main layout ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="lg:grid-cols-2 grid-cols-1">

        {/* Left: Request config */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>

          {/* Auth */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '0.6rem 1rem', borderBottom: '1px solid #1a2e22', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#b0a898' }}>Authorization</span>
            </div>
            <div style={{ padding: '0.875rem' }}>
              <select
                value={authType}
                onChange={e => setAuthType(e.target.value)}
                className="input-base"
                style={{ marginBottom: '0.6rem', fontSize: '0.75rem' }}
              >
                <option value="none">No Auth</option>
                <option value="bearer">Bearer Token</option>
                <option value="apikey">API Key (X-API-Key)</option>
                <option value="basic">Basic Auth (user:pass)</option>
              </select>
              {authType !== 'none' && (
                <input
                  type="text"
                  value={authValue}
                  onChange={e => setAuthValue(e.target.value)}
                  placeholder={authType === 'basic' ? 'username:password' : 'Enter token / key'}
                  className="input-base"
                  style={{ fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace' }}
                />
              )}
            </div>
          </div>

          {/* Headers */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '0.6rem 1rem', borderBottom: '1px solid #1a2e22', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#b0a898' }}>Headers</span>
              <button onClick={() => setHeaders(prev => [...prev, { key: '', value: '' }])} className="btn-secondary" style={{ padding: '0.15rem 0.4rem' }}>
                <Plus size={11} />
              </button>
            </div>
            <div style={{ padding: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {headers.map((h, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <input value={h.key}   onChange={e => updateHeader(i, 'key', e.target.value)}   placeholder="Key"   className="input-base" style={{ flex: 1, fontSize: '0.72rem', fontFamily: 'JetBrains Mono, monospace' }} />
                  <input value={h.value} onChange={e => updateHeader(i, 'value', e.target.value)} placeholder="Value" className="input-base" style={{ flex: 1, fontSize: '0.72rem', fontFamily: 'JetBrains Mono, monospace' }} />
                  <button onClick={() => setHeaders(prev => prev.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666660', padding: '0.2rem' }}>
                    <Minus size={11} />
                  </button>
                </div>
              ))}
              {headers.length === 0 && <p style={{ fontSize: '0.72rem', color: '#666660' }}>No headers added.</p>}
            </div>
          </div>

          {/* Body */}
          {['POST', 'PUT', 'PATCH'].includes(method) && (
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '0.6rem 1rem', borderBottom: '1px solid #1a2e22' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#b0a898' }}>Request Body (JSON)</span>
              </div>
              <div style={{ padding: '0.875rem' }}>
                <textarea
                  rows={8}
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  placeholder={'{\n  "key": "value"\n}'}
                  className="input-base"
                  style={{ resize: 'vertical', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.73rem', lineHeight: 1.7 }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right: Response */}
        <div className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: '400px' }}>

          {/* Tab bar + status */}
          <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #1a2e22' }}>
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.6rem 0.875rem', fontSize: '0.72rem', fontWeight: 500,
                  letterSpacing: '0.06em', textTransform: 'uppercase', background: 'transparent',
                  border: 'none', borderBottom: `2px solid ${activeTab === tab ? '#c9a84c' : 'transparent'}`,
                  color: activeTab === tab ? '#c9a84c' : '#666660',
                  cursor: 'pointer', marginBottom: '-1px', transition: 'color 0.15s, border-color 0.15s',
                }}>
                {tab}
              </button>
            ))}
            {resStatus !== null && (
              <div style={{ marginLeft: 'auto', padding: '0 0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <StatusBadge code={resStatus} />
                {resTime !== null && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.68rem', color: '#666660' }}>
                    <Clock size={10} />{resTime}ms
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Tab content */}
          <div style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>

            {/* Request tab */}
            {activeTab === 'Request' && (
              <div style={{ fontSize: '0.75rem', color: '#8a8a80', lineHeight: 1.8 }}>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', color: '#ede5d0', marginBottom: '0.5rem' }}>
                  <span style={{ color: METHOD_COLORS[method], fontWeight: 700 }}>{method}</span>{' '}
                  <span style={{ color: '#c9a84c' }}>{url || 'No URL'}</span>
                </p>
                <p>Configure your request in the left panel and click <strong style={{ color: '#ede5d0' }}>Send</strong> to execute.</p>
              </div>
            )}

            {/* Response tab */}
            {activeTab === 'Response' && (
              !response && !loading ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#666660', fontSize: '0.78rem' }}>
                  <Send size={28} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
                  <p>Send a request to see the response</p>
                </div>
              ) : loading ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#8a8a80', fontSize: '0.78rem' }}>
                  <svg className="animate-spin" width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto 0.75rem' }}>
                    <circle cx="12" cy="12" r="10" stroke="#c9a84c" strokeWidth="3" opacity="0.25"/>
                    <path fill="#c9a84c" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity="0.75"/>
                  </svg>
                  Sending request...
                </div>
              ) : response?._error === 'CORS_BLOCKED' ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <AlertCircle size={14} style={{ color: '#fb923c', marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#fb923c', marginBottom: '0.35rem' }}>CORS Blocked</p>
                      <p style={{ fontSize: '0.73rem', color: '#8a8a80', lineHeight: 1.7 }}>{response.message}</p>
                      <p style={{ fontSize: '0.73rem', color: '#666660', marginTop: '0.5rem', lineHeight: 1.7 }}>{response.hint}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <JsonViewer data={response} />
              )
            )}

            {/* Headers tab */}
            {activeTab === 'Headers' && (
              <div>
                <p style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#666660', marginBottom: '0.75rem' }}>Request Headers</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {headers.filter(h => h.key).map((h, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.73rem', fontFamily: 'JetBrains Mono, monospace' }}>
                      <span style={{ color: '#c9a84c', minWidth: '160px' }}>{h.key}</span>
                      <span style={{ color: '#b0a898' }}>{h.value}</span>
                    </div>
                  ))}
                  {authType !== 'none' && authValue && (
                    <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.73rem', fontFamily: 'JetBrains Mono, monospace' }}>
                      <span style={{ color: '#c9a84c', minWidth: '160px' }}>Authorization</span>
                      <span style={{ color: '#b0a898' }}>{authType === 'bearer' ? `Bearer ${authValue.substring(0, 8)}...` : '***'}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Logs tab */}
            {activeTab === 'Logs' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <p style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#666660' }}>Request Logs</p>
                  <button onClick={() => setLogs([])} className="btn-secondary" style={{ padding: '0.15rem 0.5rem', fontSize: '0.65rem' }}>Clear</button>
                </div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', lineHeight: 1.8 }}>
                  {logs.length === 0 ? (
                    <p style={{ color: '#666660' }}>No logs yet.</p>
                  ) : logs.map((log, i) => (
                    <p key={i} style={{ color: log.includes('✗') ? '#f87171' : log.includes('←') ? '#4ade80' : '#8a8a80', marginBottom: '0.1rem' }}>{log}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
