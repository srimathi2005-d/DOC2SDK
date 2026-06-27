import { useNavigate, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Home',        path: '/',           exact: true  },
  { label: 'About',       path: '/about',      exact: false },
  { label: 'Playground',  path: '/playground', exact: false },
  { label: 'Chat',        path: '/chat',       exact: false },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path, exact) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <nav style={{ borderBottom: '1px solid #1a2e22', backgroundColor: '#0b1610' }}
         className="sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="1" y="1" width="16" height="16" rx="1" stroke="#c9a84c" strokeWidth="1"/>
              <path d="M5 9h8M9 5v8" stroke="#c9a84c" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            <span style={{ color: '#ede5d0', fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Doc2SDK
            </span>
          </button>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, path, exact }) => {
              const active = isActive(path, exact);
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.72rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    fontWeight: active ? 600 : 400,
                    color: active ? '#c9a84c' : '#8a8a80',
                    background: active ? 'rgba(201,168,76,0.08)' : 'transparent',
                    border: 'none',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    transition: 'color 0.15s, background 0.15s',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#ede5d0'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#8a8a80'; }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Right CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Generate button */}
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
              style={{ padding: '0.35rem 0.9rem', fontSize: '0.7rem' }}
            >
              Generate SDK
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}
