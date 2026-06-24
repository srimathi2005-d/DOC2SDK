import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ResultCard from '../components/ResultCard.jsx';
import EndpointTable from '../components/EndpointTable.jsx';
import CodeViewer from '../components/CodeViewer.jsx';
import Loader from '../components/Loader.jsx';
import { apiService } from '../services/apiService.js';

SyntaxHighlighter.registerLanguage('bash', bash);

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { apiData, reqInfo } = location.state || {};
  
  const [generating, setGenerating] = useState(true);
  const [generationData, setGenerationData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!apiData) return;
    
    // Trigger Generation process immediately on load
    const generateCode = async () => {
      try {
        const result = await apiService.generateSDK(apiData, reqInfo.language, reqInfo.useCase);
        setGenerationData(result.data);
      } catch (err) {
        console.error(err);
        setError('Failed to generate wrapper code.');
      } finally {
        setGenerating(false);
      }
    };
    generateCode();
  }, [apiData, reqInfo]);

  if (!apiData) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <p className="text-xl text-gray-400 mb-6">No analysis data found.</p>
        <button onClick={() => navigate('/')} className="text-primary-400 hover:text-primary-300 flex items-center gap-2">
          <ArrowLeft size={20} /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/')} className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 text-gray-400 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold">Integration Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Generated for <span className="text-primary-400">{reqInfo?.url}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Summary & Endpoints */}
        <div className="space-y-8 lg:col-span-1">
          <ResultCard data={apiData} />

          {/* SDK Recommendation Card */}
          {generating ? (
            <div className="glass-dark rounded-xl p-6 shadow-lg border border-white/5 flex items-center justify-center h-32">
              <Loader text="Analyzing optimal SDK..." />
            </div>
          ) : generationData?.sdkRecommendation?.exists ? (
            <div className="glass-dark rounded-xl p-6 shadow-lg border border-white/5">
               <h2 className="text-xl font-semibold mb-4">SDK Recommendation</h2>
               <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                 <p className="text-green-400 font-medium mb-1">Official/Community SDK Found!</p>
                 <p className="text-gray-300 text-sm mb-2">{generationData.sdkRecommendation.name}</p>
                 <code className="text-xs bg-dark-900 px-2 py-1 rounded text-gray-300">{generationData.sdkRecommendation.packageCommand}</code>
               </div>
            </div>
          ) : (
            <div className="glass-dark rounded-xl p-6 shadow-lg border border-white/5">
              <h2 className="text-xl font-semibold mb-4">SDK Recommendation</h2>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <p className="text-yellow-400 font-medium mb-1 flex items-center gap-2"><AlertTriangle size={16}/> Custom Integration</p>
                <p className="text-gray-300 text-sm">No official SDK detected. Generating REST wrapper via {generationData?.sdkRecommendation?.restLibrary || 'HTTP'}.</p>
              </div>
            </div>
          )}

          <EndpointTable endpoints={apiData.endpoints} />
        </div>

        {/* Right Column: Code Generator & Guide */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Code Viewer */}
          {generating ? (
            <div className="glass-dark rounded-xl shadow-lg border border-white/5 h-[600px] flex flex-col items-center justify-center space-y-4">
              <Loader text="Generating Wrapper Code..." />
              <p className="text-sm text-gray-400 text-center px-12">Gemini is writing production-ready {reqInfo?.language} code, setting up auth handlers, and implementing endpoints.</p>
            </div>
          ) : (
            <CodeViewer 
              code={generationData?.wrapperCode} 
              language={reqInfo?.language} 
              filename={generationData?.filename} 
            />
          )}

          {/* Integration Guide */}
          {!generating && generationData?.integrationGuide && (
            <div className="glass-dark rounded-xl shadow-lg border border-white/5 p-6">
               <h2 className="text-xl font-semibold mb-4">Integration Guide</h2>
               <div className="prose prose-invert max-w-none">
                  <SyntaxHighlighter 
                    language="bash" 
                    style={vscDarkPlus}
                    customStyle={{ borderRadius: '0.5rem', padding: '1rem', background: '#1E1E1E' }}
                  >
                    {generationData.integrationGuide}
                  </SyntaxHighlighter>
               </div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg text-sm">
              {error}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
