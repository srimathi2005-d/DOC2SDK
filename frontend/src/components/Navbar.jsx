import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="border-b border-white/10 bg-dark-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded bg-gradient-to-br from-primary-500 to-blue-500 flex items-center justify-center font-bold text-lg">D</div>
            <span className="font-bold text-xl tracking-tight">Doc2SDK</span>
          </div>
          <div className="text-sm text-gray-400">
            GenAI Integration Assistant
          </div>
        </div>
      </div>
    </nav>
  );
}
