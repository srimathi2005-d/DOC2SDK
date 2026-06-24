import { useState } from 'react';
import { Copy, CheckCircle2, Code2 } from 'lucide-react';
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

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-dark rounded-xl shadow-lg border border-white/5 overflow-hidden flex flex-col h-[600px]">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-dark-800/80">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Code2 size={20} className="text-primary-400" />
          {filename || 'Generated Wrapper'}
        </h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleCopyCode}
            className="p-2 text-gray-400 hover:text-white hover:bg-dark-700 rounded transition-colors"
            title="Copy Code"
          >
            {copied ? <CheckCircle2 size={18} className="text-green-400" /> : <Copy size={18} />}
          </button>
          <DownloadButton code={code} language={language} filename={filename} />
        </div>
      </div>
      <div className="flex-grow overflow-auto bg-[#1E1E1E]">
        <SyntaxHighlighter 
          language={language === 'javascript' ? 'javascript' : language} 
          style={vscDarkPlus}
          customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent' }}
          showLineNumbers
        >
          {code || '// No code generated'}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
