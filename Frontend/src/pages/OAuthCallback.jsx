import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OAuthCallback({ onLogin }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Completing sign in...');

  useEffect(() => {
    // Token comes from backend as URL param: /oauth-callback?token=xxx&user=xxx
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userParam = params.get('user');

    if (token) {
      try {
        // Parse user info if provided as JSON string
        const user = userParam
          ? JSON.parse(decodeURIComponent(userParam))
          : { name: 'User', email: '' };

        // Save to localStorage
        localStorage.setItem('legal-eyes_token', token);
        localStorage.setItem('legal-eyes_user', JSON.stringify(user));

        // Update app state
        onLogin({ token, user });

        setStatus('Signed in! Redirecting...');
        setTimeout(() => navigate('/upload'), 1000);

      } catch (err) {
        setStatus('Something went wrong. Redirecting to login...');
        setTimeout(() => navigate('/auth'), 2000);
      }
    } else {
      setStatus('No token found. Redirecting to login...');
      setTimeout(() => navigate('/auth'), 2000);
    }
  }, []);

  return (
    <div className="ls-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ textAlign: 'center' }}>
        {/* Spinner */}
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          border: '3px solid var(--parchment-3)',
          borderTop: '3px solid var(--gold)',
          margin: '0 auto 24px',
          animation: 'lsSpin 0.8s linear infinite'
        }}></div>
        <style>{`@keyframes lsSpin { to { transform: rotate(360deg); } }`}</style>

        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 22, fontWeight: 300,
          color: 'var(--ink)', marginBottom: 8
        }}>
          {status}
        </p>
        <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>
          Please wait...
        </p>
      </div>
    </div>
  );
}
