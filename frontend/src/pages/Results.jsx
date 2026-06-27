import { useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle, Package, ChevronLeft, MessageSquare, Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ResultCard from '../components/ResultCard.jsx';
import EndpointTable from '../components/EndpointTable.jsx';
import CodeViewer from '../components/CodeViewer.jsx';
import Loader from '../components/Loader.jsx';
import ComplexityDashboard from '../components/ComplexityDashboard.jsx';
import ZipDownload from '../components/ZipDownload.jsx';
import { apiService } from '../services/apiService.js';

SyntaxHighlighter.registerLanguage('bash', bash);

const TABS = ['Code', 'Guide', 'Dashboard', 'Download'];

export default function Results() {
  const location   = useLocation();
  const navigate   = useNavigate();
  const { apiData, reqInfo } = location.state || {};

  const [generating,     setGenerating]     = useState(true);
  const [generationData, setGenerationData] = useState(null);
  const [error,          setError]          = useState(null);
  const [activeTab,      setActiveTab]      = useState('Code');

  useEffect(() => {
    if (!apiData) return;
    // Save to sessionStorage for Chat and Playground pages
    try {
      sessionStorage.setItem('doc2sdk_apiData', JSON.stringify(apiData));
    } catch {}

    const run = async () => {
      try {
        const result = await apiService.generateSDK(apiData, reqInfo.language, reqInfo.useCase);
        setGenerationData(result.data);
        // Also save generationData
        try { sessionStorage.setItem('doc2sdk_generationData', JSON.stringify(result.data)); } catch {}
      } catch (err) {
        setError('Failed to generate wrapper code.');
      } finally {
        setGenerating(false);
      }
    };
    run();
  }, [apiData, reqInfo]);

  if (!apiData) {
    return (
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: '#8a8a80', fontSize: '0.875rem', marginBottom: '1rem' }}>No analysis data found.</p>
        <button onClick={() => navigate('/')} className="btn-secondary">
          <ChevronLeft size={14} /> Back to home
        </button>
      </div>
    );
  }

  const sdk = generationData?.sdkRecommendation;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>

      {/* ── Page header ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button onClick={() => navigate('/')} className="btn-secondary" style={{ padding: '0.35rem 0.6rem' }}>
          <ChevronLeft size={14} />
        </button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#c9a84c', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Integration Dashboard
          </h1>
          <p style={{ fontSize: '0.72rem', color: '#8a8a80', marginTop: '0.2rem' }}>
            Source:&nbsp;
            <a href={reqInfo?.url} target="_blank" rel="noopener noreferrer"
              style={{ color: '#c9a84c', fontFamily: 'JetBrains Mono, monospace', opacity: 0.8 }}>
              {reqInfo?.url}
            </a>
          </p>
        </div>

        {/* Quick access buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.7rem', fontFamily: 'JetBrains Mono, monospace', color: '#c9a84c', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', padding: '0.25rem 0.6rem', borderRadius: '2px' }}>
            {reqInfo?.language}
          </span>
          <button onClick={() => navigate('/chat')} className="btn-secondary" style={{ padding: '0.3rem 0.65rem', fontSize: '0.68rem' }}>
            <MessageSquare size={11} /> Ask Docs
          </button>
          <button onClick={() => navigate('/playground')} className="btn-secondary" style={{ padding: '0.3rem 0.65rem', fontSize: '0.68rem' }}>
            <Play size={11} /> Playground
          </button>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', alignItems: 'start' }}
        className="lg:grid-cols-[1fr_2fr] grid-cols-1">

        {/* Left panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <ResultCard data={apiData} />

          {/* SDK card */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #1a2e22', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Package size={12} style={{ color: '#8a8a80' }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#b0a898' }}>
                SDK Recommendation
              </span>
            </div>
            <div style={{ padding: '1rem' }}>
              {generating ? (
                <Loader text="Detecting SDK..." />
              ) : sdk?.exists ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={13} style={{ color: '#22c55e' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#22c55e' }}>Official SDK Found</span>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.65rem', color: '#666660', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Package</p>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ede5d0' }}>{sdk.name}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.65rem', color: '#666660', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Install</p>
                    <code style={{ fontSize: '0.72rem', fontFamily: 'JetBrains Mono, monospace', color: '#c9a84c', background: '#0b1610', border: '1px solid #1a2e22', padding: '0.35rem 0.6rem', borderRadius: '3px', display: 'block', wordBreak: 'break-all' }}>
                      {sdk.packageCommand}
                    </code>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertTriangle size={13} style={{ color: '#d4b565' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#d4b565' }}>Custom Integration</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#8a8a80', lineHeight: 1.7 }}>
                    No official SDK detected. Generated REST wrapper using{' '}
                    <code style={{ fontFamily: 'JetBrains Mono, monospace', color: '#ede5d0' }}>{sdk?.restLibrary || 'HTTP'}</code>.
                  </p>
                </div>
              )}
            </div>
          </div>

          <EndpointTable endpoints={apiData.endpoints} />
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Tab bar */}
          <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #1a2e22' }}>
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.65rem 1.25rem',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: activeTab === tab ? '#c9a84c' : '#666660',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: `2px solid ${activeTab === tab ? '#c9a84c' : 'transparent'}`,
                  cursor: 'pointer',
                  marginBottom: '-1px',
                  transition: 'color 0.15s, border-color 0.15s',
                }}>
                {tab}
              </button>
            ))}
            <div style={{ marginLeft: 'auto', paddingBottom: '0.5rem' }}>
              {generating && <Loader text="Generating..." />}
            </div>
          </div>

          {/* ── Code tab ── */}
          {activeTab === 'Code' && (
            generating ? (
              <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', gap: '0.75rem' }}>
                <Loader text="Generating wrapper code..." />
                <p style={{ fontSize: '0.75rem', color: '#666660', textAlign: 'center', maxWidth: '280px', lineHeight: 1.7 }}>
                  AI is writing production-ready {reqInfo?.language} code with auth handling and endpoint implementations.
                </p>
              </div>
            ) : error ? (
              <div className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#f87171' }}>
                  <AlertTriangle size={14} style={{ marginTop: '1px', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Generation Failed</p>
                    <p style={{ fontSize: '0.75rem', color: '#8a8a80' }}>{error}</p>
                  </div>
                </div>
              </div>
            ) : (
              <CodeViewer code={generationData?.wrapperCode} language={reqInfo?.language} filename={generationData?.filename} />
            )
          )}

          {/* ── Guide tab ── */}
          {activeTab === 'Guide' && (
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #1a2e22' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#b0a898' }}>
                  Integration Guide
                </span>
              </div>
              {generating ? (
                <div style={{ padding: '1.5rem' }}><Loader text="Generating guide..." /></div>
              ) : generationData?.integrationGuide ? (
                <SyntaxHighlighter language="bash" style={vscDarkPlus}
                  customStyle={{ margin: 0, padding: '1.25rem', background: '#060d09', fontSize: '12px', fontFamily: '"JetBrains Mono", Menlo, monospace', lineHeight: '1.8', borderRadius: 0 }}>
                  {generationData.integrationGuide}
                </SyntaxHighlighter>
              ) : (
                <p style={{ padding: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: '#666660' }}>No guide available.</p>
              )}
            </div>
          )}

          {/* ── Dashboard tab ── */}
          {activeTab === 'Dashboard' && (
            generating ? (
              <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', gap: '0.75rem' }}>
                <Loader text="Computing metrics..." />
              </div>
            ) : (
              <ComplexityDashboard apiData={apiData} generationData={generationData} />
            )
          )}

          {/* ── Download tab ── */}
          {activeTab === 'Download' && (
            generating ? (
              <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', gap: '0.75rem' }}>
                <Loader text="Preparing download..." />
              </div>
            ) : (
              <ZipDownload apiData={apiData} generationData={generationData} language={reqInfo?.language || 'javascript'} />
            )
          )}

        </div>
      </div>
    </div>
  );
}
