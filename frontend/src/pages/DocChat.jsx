import { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Zap, BookOpen, Lock, List } from 'lucide-react';
import { apiService } from '../services/apiService.js';

/* ── Suggested prompts ───────────────────────────────── */
const SUGGESTED = [
  'What endpoints are available?',
  'How do I authenticate with this API?',
  'What headers are required?',
  'Show me an example request',
  'What are the rate limits?',
  'How do I handle errors?',
];

/* ── Typing animation ───────────────────────────────── */
function TypingDots() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0.4rem 0' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: '#c9a84c',
          animation: `typingDot 1.2s ${i * 0.2}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
}

/* ── Message bubble ─────────────────────────────────── */
function Message({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: '1rem' }}>
      {!isUser && (
        <div style={{ width: '28px', height: '28px', borderRadius: '4px', background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginRight: '0.6rem', marginTop: '2px' }}>
          <Zap size={12} style={{ color: '#c9a84c' }} />
        </div>
      )}
      <div style={{
        maxWidth: '78%',
        padding: '0.75rem 1rem',
        borderRadius: '4px',
        fontSize: '0.8rem',
        lineHeight: 1.8,
        whiteSpace: 'pre-wrap',
        ...(isUser ? {
          background: 'rgba(201,168,76,0.08)',
          border: '1px solid rgba(201,168,76,0.18)',
          color: '#ede5d0',
        } : {
          background: '#0f1d14',
          border: '1px solid #1a2e22',
          color: '#b0a898',
        }),
      }}>
        {msg.content}
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────── */
export default function DocChat() {
  const [messages,    setMessages]    = useState([]);
  const [input,       setInput]       = useState('');
  const [loading,     setLoading]     = useState(false);
  const [apiData,     setApiData]     = useState(null);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  /* Load apiData from sessionStorage */
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('doc2sdk_apiData');
      if (raw) {
        const data = JSON.parse(raw);
        setApiData(data);
        setMessages([{
          role: 'assistant',
          content: `👋 Hi! I'm your API Integration Assistant for **${data.baseUrl || 'this API'}**.\n\nI have access to the full documentation context. Ask me anything about the endpoints, authentication, request formats, or integration patterns.`,
        }]);
      } else {
        setMessages([{
          role: 'assistant',
          content: `⚠️ No API documentation loaded yet.\n\nPlease go to the **Home** page, analyze an API documentation URL first, then come back here. Once you run an analysis, I'll have the full context to answer your questions.`,
        }]);
      }
    } catch {
      setMessages([{ role: 'assistant', content: 'Failed to load API context.' }]);
    }
  }, []);

  /* Auto-scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const question = (text || input).trim();
    if (!question || loading) return;

    const userMsg = { role: 'user', content: question };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      if (!apiData) throw new Error('No API context loaded. Please analyze a documentation URL first.');
      const apiContext = JSON.stringify(apiData, null, 2);
      const answer = await apiService.chatWithDocs(question, apiContext);
      setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error: ${err.response?.data?.error || err.message || 'Failed to get response.'}`,
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const hasContext = !!apiData;

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)', minHeight: '500px' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#c9a84c', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={14} /> Ask the Documentation
          </h1>
          <p style={{ fontSize: '0.72rem', color: '#8a8a80' }}>
            AI assistant powered by your analyzed API context — not general knowledge
          </p>
        </div>
        {hasContext && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.75rem', borderRadius: '2px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80' }} />
            <span style={{ fontSize: '0.68rem', color: '#4ade80', fontFamily: 'JetBrains Mono, monospace' }}>
              {apiData.baseUrl?.replace(/https?:\/\//, '').split('/')[0] || 'API'} loaded
            </span>
          </div>
        )}
      </div>

      {/* ── Context info cards ── */}
      {hasContext && (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {[
            { icon: <BookOpen size={11} />, text: `${(apiData.endpoints || []).length} endpoints` },
            { icon: <Lock size={11} />,     text: apiData.authentication || 'No auth' },
            { icon: <List size={11} />,     text: apiData.baseUrl || 'No base URL' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.2rem 0.6rem', borderRadius: '2px', background: '#0f1d14', border: '1px solid #1a2e22' }}>
              <span style={{ color: '#666660' }}>{item.icon}</span>
              <span style={{ fontSize: '0.68rem', color: '#8a8a80', fontFamily: 'JetBrains Mono, monospace' }}>{item.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Message list ── */}
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem', paddingRight: '4px' }}>

        {messages.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#666660', fontSize: '0.8rem' }}>
            <MessageSquare size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
            <p>No messages yet. Ask a question below.</p>
          </div>
        )}

        {messages.map((msg, i) => <Message key={i} msg={msg} />)}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '4px', background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginRight: '0.6rem', marginTop: '2px' }}>
              <Zap size={12} style={{ color: '#c9a84c' }} />
            </div>
            <div style={{ padding: '0.6rem 1rem', borderRadius: '4px', background: '#0f1d14', border: '1px solid #1a2e22' }}>
              <TypingDots />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Suggested prompts ── */}
      {messages.length <= 1 && !loading && (
        <div style={{ marginBottom: '0.875rem' }}>
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#666660', marginBottom: '0.5rem' }}>
            Suggested questions
          </p>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {SUGGESTED.map(s => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                disabled={!hasContext || loading}
                style={{
                  padding: '0.3rem 0.7rem', borderRadius: '2px', fontSize: '0.7rem',
                  background: '#0f1d14', border: '1px solid #1a2e22', color: '#8a8a80',
                  cursor: hasContext ? 'pointer' : 'default', transition: 'border-color 0.15s, color 0.15s',
                }}
                onMouseEnter={e => { if (hasContext) { e.currentTarget.style.borderColor = '#c9a84c'; e.currentTarget.style.color = '#c9a84c'; }}}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a2e22'; e.currentTarget.style.color = '#8a8a80'; }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Input ── */}
      <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-end' }}>
        <textarea
          ref={inputRef}
          rows={2}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={hasContext ? 'Ask anything about this API...' : 'Analyze a documentation URL on the Home page first...'}
          disabled={!hasContext || loading}
          className="input-base"
          style={{ flex: 1, resize: 'none', opacity: !hasContext ? 0.5 : 1 }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || !hasContext || loading}
          className="btn-primary"
          style={{ padding: '0.55rem 1rem', flexShrink: 0, alignSelf: 'stretch' }}
        >
          <Send size={14} />
        </button>
      </div>
      <p style={{ fontSize: '0.65rem', color: '#666660', marginTop: '0.5rem', textAlign: 'center' }}>
        Responses are generated using documentation context, not general AI knowledge · Press Enter to send
      </p>

      {/* CSS for typing animation */}
      <style>{`
        @keyframes typingDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
