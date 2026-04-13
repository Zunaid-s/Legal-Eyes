import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API = 'https://legal-ai-livid-six.vercel.app';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

export default function Auth({ onLogin, showToast }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupFirst, setSignupFirst] = useState('');
  const [signupLast, setSignupLast] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  // ── Google OAuth ──────────────────────────────────────────────────────────
  function handleGoogleLogin() {
    // Redirect browser to backend Google OAuth endpoint
    // Backend will redirect back to /oauth-callback?token=xxx after success
    window.location.href = `${API}/auth/google`;
  }

  // ── Email Login ───────────────────────────────────────────────────────────
  async function handleLogin() {
    if (!loginEmail || !loginPassword) return showToast('Please enter email and password.');
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) return showToast(data.error || 'Login failed.');
      localStorage.setItem('lexsimple_token', data.token);
      localStorage.setItem('lexsimple_user', JSON.stringify(data.user));
      onLogin(data);
      showToast(`Welcome back, ${data.user.name}!`);
      setTimeout(() => navigate('/upload'), 1000);
    } catch {
      showToast('Cannot reach server. Is the backend running?');
    }
  }

  // ── Email Signup ──────────────────────────────────────────────────────────
  async function handleSignup() {
    const name = `${signupFirst} ${signupLast}`.trim();
    if (!name || !signupEmail || !signupPassword) return showToast('Please fill in all fields.');
    try {
      const res = await fetch(`${API}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: signupEmail, password: signupPassword }),
      });
      const data = await res.json();
      if (!res.ok) return showToast(data.error || 'Signup failed.');
      localStorage.setItem('lexsimple_token', data.token);
      localStorage.setItem('lexsimple_user', JSON.stringify(data.user));
      onLogin(data);
      showToast(`Welcome to LexSimple, ${data.user.name}!`);
      setTimeout(() => navigate('/upload'), 1000);
    } catch {
      showToast('Cannot reach server. Is the backend running?');
    }
  }

  return (
    <div className="ls-page">
      <div className="ls-auth-page">
        <div className="ls-auth-container">

          {/* ── Left panel ── */}
          <div className="ls-auth-panel left">
            <div>
              <h2>Understand <em>every</em> contract you ever sign.</h2>
              <p>Join thousands of people who've stopped blindly signing legal documents. LexSimple puts the power back in your hands.</p>
            </div>

            {/* Google OAuth button - prominent on left panel too */}
            <div style={{ margin: '32px 0' }}>
              <button
                onClick={handleGoogleLogin}
                style={{
                  width: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                  background: 'white', border: 'none',
                  borderRadius: 10, padding: '13px 20px',
                  fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
                  color: '#3a3935', cursor: 'pointer',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.15)'; }}
              >
                <GoogleIcon />
                Continue with Google
              </button>
            </div>

            <div className="ls-auth-testimonial">
              <blockquote>"I finally understood my employment contract before signing. Found a non-compete clause that would've cost me my next job."</blockquote>
              <div className="attr">— Priya M., Software Engineer</div>
            </div>
          </div>

          {/* ── Right panel ── */}
          <div className="ls-auth-panel">

            {/* Google button at top of form */}
            <button
              onClick={handleGoogleLogin}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                background: 'var(--white)', border: '1px solid var(--parchment-3)',
                borderRadius: 10, padding: '12px 20px', marginBottom: 20,
                fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
                color: 'var(--ink-2)', cursor: 'pointer',
                transition: 'background 0.2s, box-shadow 0.2s',
              }}
              onMouseOver={e => { e.currentTarget.style.background = 'var(--parchment)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'var(--white)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <GoogleIcon />
              Login with Google
            </button>

            <div className="ls-form-divider" style={{ marginBottom: 20 }}>
              <span>or use email</span>
            </div>

            <div className="ls-auth-tabs">
              <button className={`ls-auth-tab${tab === 'login' ? ' active' : ''}`} onClick={() => setTab('login')}>Sign In</button>
              <button className={`ls-auth-tab${tab === 'signup' ? ' active' : ''}`} onClick={() => setTab('signup')}>Create Account</button>
            </div>

            {tab === 'login' ? (
              <div className="ls-auth-form">
                <h3>Welcome back</h3>
                <div className="ls-form-group">
                  <label>Email address</label>
                  <input type="email" placeholder="you@example.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
                </div>
                <div className="ls-form-group">
                  <label>Password</label>
                  <input type="password" placeholder="••••••••" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
                </div>
                <button className="ls-form-submit" onClick={handleLogin}>Sign In</button>
              </div>
            ) : (
              <div className="ls-auth-form">
                <h3>Create your account</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="ls-form-group">
                    <label>First name</label>
                    <input type="text" placeholder="Jane" value={signupFirst} onChange={e => setSignupFirst(e.target.value)} />
                  </div>
                  <div className="ls-form-group">
                    <label>Last name</label>
                    <input type="text" placeholder="Doe" value={signupLast} onChange={e => setSignupLast(e.target.value)} />
                  </div>
                </div>
                <div className="ls-form-group">
                  <label>Email address</label>
                  <input type="email" placeholder="you@example.com" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} />
                </div>
                <div className="ls-form-group">
                  <label>Create password</label>
                  <input type="password" placeholder="Minimum 8 characters" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} />
                </div>
                <button className="ls-form-submit" onClick={handleSignup}>Create Account</button>
                <p style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 14, textAlign: 'center' }}>
                  By signing up you agree to our <a href="#" style={{ color: 'var(--gold)' }}>Terms</a> and <a href="#" style={{ color: 'var(--gold)' }}>Privacy Policy</a>.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
