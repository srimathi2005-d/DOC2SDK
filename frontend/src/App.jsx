import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';

function App() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0b1610' }}>
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer style={{ borderTop: '1px solid #1a2e22', padding: '1.5rem 0' }}>
        <div className="max-w-screen-xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span style={{ fontSize: '0.7rem', color: '#666660', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Doc2SDK — API SDK Generator
          </span>
          <span style={{ fontSize: '0.7rem', color: '#c9a84c', letterSpacing: '0.06em' }}>
            Powered by Groq AI
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
