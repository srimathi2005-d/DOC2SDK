import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <nav style={{ borderBottom: '1px solid #1a2e22', backgroundColor: '#0b1610' }}
         className="sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">

          {/* Logo wordmark */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 group"
          >
            {/* Small decorative icon */}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="1" y="1" width="16" height="16" rx="1" stroke="#c9a84c" strokeWidth="1"/>
              <path d="M5 9h8M9 5v8" stroke="#c9a84c" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            <span style={{ color: '#ede5d0', fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Doc2SDK
            </span>
          </button>

          {/* Center nav links */}
          <div className="hidden md:flex items-center gap-8">
            {['Generator', 'Docs', 'About'].map(item => (
              <span key={item}
                style={{ color: '#8a8a80', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'default' }}>
                {item}
              </span>
            ))}
          </div>

          {/* Right */}
          <a
            href="https://console.groq.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ padding: '0.35rem 0.9rem', fontSize: '0.7rem' }}
          >
            Get API Key
          </a>

        </div>
      </div>
    </nav>
  );
}
