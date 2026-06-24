import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';

function App() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-primary-500 selection:text-white">
      <div className="fixed inset-0 z-[-1] bg-dark-900">
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-primary-900/20 to-transparent"></div>
      </div>

      <Navbar />

      <main className="flex-grow">
        <Outlet />
      </main>
      
      <footer className="border-t border-white/10 py-8 text-center text-gray-500 text-sm bg-dark-900/80">
        <p>Built with React, Vite, and Gemini AI. Hackathon Project.</p>
      </footer>
    </div>
  );
}

export default App;
