import { CheckCircle2, AlertTriangle } from 'lucide-react';

export default function ResultCard({ data }) {
  return (
    <div className="space-y-6">
      <div className="glass-dark rounded-xl p-6 border-t-4 border-t-primary-500 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <CheckCircle2 className="text-green-400" size={20} />
          API Summary
        </h2>
        <div className="space-y-4 text-sm">
          <div>
            <span className="text-gray-400 block mb-1">Base URL</span>
            <code className="bg-dark-900 px-2 py-1 rounded text-primary-300 break-all">{data.baseUrl || 'Unknown'}</code>
          </div>
          <div>
            <span className="text-gray-400 block mb-1">Authentication</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {data.authentication || 'None Detected'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
