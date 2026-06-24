import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, Cpu, Zap } from 'lucide-react';
import InputForm from '../components/InputForm.jsx';
import { apiService } from '../services/apiService.js';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleAnalyze = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      // Step 1: Analyze Documentation
      const apiData = await apiService.analyzeDocs(formData.url, formData.useCase, formData.language);
      
      // We pass the partial data to the Results page where the Generation step will happen
      navigate('/results', { state: { apiData, reqInfo: formData } });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to process documentation. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          From Docs to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-blue-400">SDK</span> in Seconds
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Paste any API documentation URL and let our GenAI instantly generate production-ready wrappers, authentication setups, and integration guides.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}
          <InputForm onSubmit={handleAnalyze} loading={loading} />
        </div>

        <div className="space-y-8 lg:pl-12">
          <FeatureCard 
            icon={<Cpu className="text-primary-400" size={28} />}
            title="AI Semantic Analysis"
            desc="Gemini extracts auth patterns, rate limits, and endpoint schemas even from messy HTML."
          />
          <FeatureCard 
            icon={<Code2 className="text-blue-400" size={28} />}
            title="Production-Ready Wrappers"
            desc="Generates idiomatic, type-safe (where applicable) SDKs with built-in error handling."
          />
          <FeatureCard 
            icon={<Zap className="text-yellow-400" size={28} />}
            title="Zero to Integrated in Minutes"
            desc="Stop writing boilerplate. Get usage examples and setup instructions instantly."
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="flex gap-4 p-6 rounded-xl glass-dark hover:bg-dark-800/80 transition-colors">
      <div className="flex-shrink-0 mt-1">
        <div className="w-12 h-12 rounded-lg bg-dark-900 border border-white/10 flex items-center justify-center shadow-inner">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
