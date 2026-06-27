import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Home from './pages/Home.jsx';
import Results from './pages/Results.jsx';
import About from './pages/About.jsx';
import Playground from './pages/Playground.jsx';
import DocChat from './pages/DocChat.jsx';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index              element={<Home />}       />
          <Route path="results"     element={<Results />}    />
          <Route path="about"       element={<About />}      />
          <Route path="playground"  element={<Playground />} />
          <Route path="chat"        element={<DocChat />}    />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
