import { useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

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
  }

  function handleLogout() {
    setAuthToken(null);
    setCurrentUser(null);
    localStorage.removeItem('legal-eyes_token');
    localStorage.removeItem('legal-eyes_user');
    showToast('Logged out.');
  }

  return (
    /* Global Wrapper: Sets the background and text color based on your OKLCH theme */
    <div className="min-h-screen bg-base-100 text-base-content selection:bg-primary selection:text-primary-content">
      <Router>
        <Navbar currentUser={currentUser} onLogout={handleLogout} />

        {/* Main Content Area with standard padding and width */}
        <main className="container mx-auto px-4 md:px-8 py-10">
          <Routes>
            <Route path="/"               element={<Home />} />
            <Route path="/about"          element={<About />} />
            <Route path="/auth"           element={<Auth onLogin={handleLogin} showToast={showToast} />} />
            <Route path="/oauth-callback" element={<OAuthCallback onLogin={handleLogin} />} />

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

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Toast message={toast.msg} show={toast.show} />
      </Router>
    </div>
  );
}