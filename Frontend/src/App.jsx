import { useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Styles
import './styles/LexSimple.css';

// Components
import Navbar from './components/Navbar';
import Toast from './components/Toast';

// Pages
import Home from './pages/Home';
import Auth from './pages/Auth';
import OAuthCallback from './pages/OAuthCallback';
import UploadPage from './pages/UploadPage';
import Summary from './pages/Summary';
import About from './pages/About';
import ContactPage from './pages/ContactPage';

export default function App() {
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('lexsimple_token'));
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('lexsimple_user') || 'null'));
  const [analysisData, setAnalysisData] = useState(null);
  const [toast, setToast] = useState({ msg: '', show: false });
  const toastTimer = useRef(null);

  function showToast(msg) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, show: true });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  }

  function handleLogin(data) {
    setAuthToken(data.token);
    setCurrentUser(data.user);
  }

  function handleLogout() {
    setAuthToken(null);
    setCurrentUser(null);
    localStorage.removeItem('lexsimple_token');
    localStorage.removeItem('lexsimple_user');
    showToast('Logged out.');
  }

  return (
    <Router>
      <Navbar currentUser={currentUser} onLogout={handleLogout} />

      <Routes>
        <Route path="/"               element={<Home />} />
        <Route path="/auth"           element={<Auth onLogin={handleLogin} showToast={showToast} />} />
        <Route path="/oauth-callback" element={<OAuthCallback onLogin={handleLogin} />} />
        <Route path="/upload"         element={<UploadPage authToken={authToken} showToast={showToast} onAnalysisComplete={setAnalysisData} />} />
        <Route path="/summary"        element={<Summary analysisData={analysisData} />} />
        <Route path="/about"          element={<About />} />
        <Route path="/contact"        element={<ContactPage showToast={showToast} />} />
      </Routes>

      <Toast message={toast.msg} show={toast.show} />
    </Router>
  );
}

