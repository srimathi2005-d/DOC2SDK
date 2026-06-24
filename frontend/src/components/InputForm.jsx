import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Loader from './Loader.jsx';

export default function InputForm({ onSubmit, loading }) {
  const [url, setUrl] = useState('');
  const [useCase, setUseCase] = useState('');
  const [language, setLanguage] = useState('javascript');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ url, useCase, language });
  };

  return (
    <div className="glass-dark rounded-2xl p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-blue-500"></div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">API Documentation URL</label>
          <input
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://stripe.com/docs/api"
            className="w-full bg-dark-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Intended Use Case (Optional)</label>
          <textarea
            rows="3"
            value={useCase}
            onChange={(e) => setUseCase(e.target.value)}
            placeholder="e.g. I need to create payments and handle refunds."
            className="w-full bg-dark-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Target Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full bg-dark-900 border border-gray-700 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          >
            <option value="javascript">JavaScript / Node.js</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 px-6 rounded-lg text-white font-medium text-lg flex items-center justify-center gap-2 transition-all ${loading ? 'bg-primary-600/50 cursor-not-allowed' : 'bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-500 hover:to-blue-500'}`}
        >
          {loading ? <Loader text="Analyzing..." /> : <><ArrowRight size={20} /> Generate SDK</>}
        </button>
      </form>
    </div>
  );
}
