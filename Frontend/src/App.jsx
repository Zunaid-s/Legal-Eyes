import { useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

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
import History from './pages/History';
import About from './pages/About';
import ContactPage from './pages/ContactPage';

/**
 * ProtectedRoute Component
 * Acts as a guard for authenticated routes. 
 * If no authToken exists, it redirects the user to the /auth page.
 */
const ProtectedRoute = ({ children, authToken }) => {
  if (!authToken) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

export default function App() {
  const [authToken, setAuthToken]     = useState(() => localStorage.getItem('legal-eyes_token'));
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('legal-eyes_user') || 'null'));
  const [analysisData, setAnalysisData] = useState(null);
  const [toast, setToast]             = useState({ msg: '', show: false });
  const toastTimer = useRef(null);

  function showToast(msg) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, show: true });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  }

  function handleLogin(data) {
    setAuthToken(data.token);
    setCurrentUser(data.user);
    // Data is already saved to localStorage in Auth.jsx/OAuthCallback.jsx
  }

  function handleLogout() {
    setAuthToken(null);
    setCurrentUser(null);
    localStorage.removeItem('legal-eyes_token');
    localStorage.removeItem('legal-eyes_user');
    showToast('Logged out.');
  }

  return (
    <Router>
      <Navbar currentUser={currentUser} onLogout={handleLogout} />

      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/"               element={<Home />} />
        <Route path="/about"          element={<About />} />
        <Route path="/auth"           element={<Auth onLogin={handleLogin} showToast={showToast} />} />
        <Route path="/oauth-callback" element={<OAuthCallback onLogin={handleLogin} />} />

        {/* --- Protected Routes --- */}
        <Route 
          path="/upload" 
          element={
            <ProtectedRoute authToken={authToken}>
              <UploadPage authToken={authToken} showToast={showToast} onAnalysisComplete={setAnalysisData} />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/summary" 
          element={
            <ProtectedRoute authToken={authToken}>
              <Summary analysisData={analysisData} />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/history" 
          element={
            <ProtectedRoute authToken={authToken}>
              <History authToken={authToken} onLoadSummary={setAnalysisData} />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/contact" 
          element={
            <ProtectedRoute authToken={authToken}>
              <ContactPage showToast={showToast} />
            </ProtectedRoute>
          } 
        />

        {/* Fallback for undefined routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toast message={toast.msg} show={toast.show} />
    </Router>
  );
}