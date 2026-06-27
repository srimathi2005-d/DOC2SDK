import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import DownloadButton from './DownloadButton.jsx';

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('java', java);

export default function CodeViewer({ code, language, filename }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: '480px', maxHeight: '640px' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.6rem 1rem',
        borderBottom: '1px solid #1a2e22',
        backgroundColor: '#0f1d14',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2">
            <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
          </svg>
          <span style={{ fontSize: '0.72rem', fontFamily: 'JetBrains Mono, monospace', color: '#b0a898' }}>
            {filename || 'generated_client'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button onClick={handleCopy} className="btn-secondary"
            style={{ padding: '0.25rem 0.6rem', fontSize: '0.7rem', gap: '0.3rem' }}>
            {copied
              ? <><Check size={11} style={{ color: '#22c55e' }} /><span style={{ color: '#22c55e' }}>Copied</span></>
              : <><Copy size={11} />Copy</>
            }
          </button>
          <DownloadButton code={code} language={language} filename={filename} />
        </div>
      </div>

      {/* Code body */}
      <div style={{ flexGrow: 1, overflowY: 'auto', background: '#060d09' }}>
        <SyntaxHighlighter
          language={language === 'javascript' ? 'javascript' : language}
          style={vscDarkPlus}
          showLineNumbers
          customStyle={{
            margin: 0,
            padding: '1rem 1rem 1rem 0',
            background: 'transparent',
            fontSize: '12.5px',
            fontFamily: '"JetBrains Mono", Menlo, monospace',
            lineHeight: '1.7',
          }}
          lineNumberStyle={{
            minWidth: '3em',
            paddingRight: '1em',
            color: '#243a2a',
            borderRight: '1px solid #1a2e22',
            marginRight: '1em',
            userSelect: 'none',
          }}
        >
          {code || '// No code generated yet.'}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
