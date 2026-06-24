import { Download } from 'lucide-react';

export default function DownloadButton({ code, language, filename }) {
  const handleDownload = () => {
    const extMap = { 'javascript': 'js', 'python': 'py', 'java': 'java' };
    const ext = extMap[language] || 'txt';
    const finalName = filename || `api_client.${ext}`;
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = finalName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button 
      onClick={handleDownload}
      className="flex items-center gap-2 px-3 py-1.5 bg-primary-600 hover:bg-primary-500 text-white text-sm rounded transition-colors shadow-lg shadow-primary-500/20"
    >
      <Download size={16} /> Download
    </button>
  );
}
