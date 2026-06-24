export default function EndpointTable({ endpoints }) {
  const getMethodColor = (method) => {
    switch(method?.toUpperCase()) {
      case 'GET': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'POST': return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'PUT': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      case 'DELETE': return 'bg-red-500/20 text-red-400 border border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };

  return (
    <div className="glass-dark rounded-xl p-6 shadow-lg border border-white/5 overflow-hidden flex flex-col max-h-[500px]">
      <h2 className="text-xl font-semibold mb-4">Detected Endpoints ({endpoints?.length || 0})</h2>
      <div className="overflow-y-auto pr-2 space-y-3 flex-grow">
        {endpoints?.map((ep, idx) => (
          <div key={idx} className="bg-dark-900/50 p-3 rounded-lg border border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${getMethodColor(ep.method)}`}>
                {ep.method}
              </span>
              <code className="text-xs text-gray-300 truncate">{ep.path}</code>
            </div>
            <p className="text-xs text-gray-400 truncate" title={ep.purpose}>{ep.purpose}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
