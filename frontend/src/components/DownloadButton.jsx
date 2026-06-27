import { Download } from 'lucide-react';

export default function DownloadButton({ code, language, filename }) {
  const handleDownload = () => {
    const extMap = { javascript: 'js', python: 'py', java: 'java' };
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
      className="btn-primary"
      style={{ padding: '0.3rem 0.75rem', fontSize: '0.7rem', gap: '0.35rem' }}
    >
      <Download size={12} />
      Download
    </button>
  );
}
