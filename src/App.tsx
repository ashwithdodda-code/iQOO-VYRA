import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BottomNav, SideNav } from './components/Navigation';
import { VYRAHome } from './pages/VYRAHome';
import { SessionPage } from './pages/SessionPage';
import { ControlCenterPage } from './pages/ControlCenterPage';
import { DNAPage } from './pages/DNAPage';
import { InsightsPage } from './pages/InsightsPage';
import { AdvantagePage } from './pages/AdvantagePage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-vyra-black text-vyra-text">
        <SideNav />
        <main className="md:ml-16 max-w-lg mx-auto">
          <Routes>
            <Route path="/" element={<VYRAHome />} />
            <Route path="/session" element={<SessionPage />} />
            <Route path="/advantage" element={<AdvantagePage />} />
            <Route path="/controls" element={<ControlCenterPage />} />
            <Route path="/dna" element={<DNAPage />} />
            <Route path="/insights" element={<InsightsPage />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
