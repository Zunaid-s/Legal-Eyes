import { useState, useRef, useCallback, useEffect } from 'react';
import './LexSimple.css';

const API = 'https://legal-ai-livid-six.vercel.app';

// ─── GOOGLE ICON ────────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const GitHubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path fill="#24292e" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

// ─── COLLAPSIBLE SUMMARY SECTION ─────────────────────────────────────────────
function SummarySection({ icon, title, badge, summary, children, plain, plainLabel }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="ls-summary-section">
      <div className="ls-ss-header" onClick={() => setOpen(o => !o)}>
        <div className="ls-ss-icon">{icon}</div>
        <div className="ls-ss-title">{title}</div>
        <span className="ls-ss-badge">{badge}</span>
        <div className="ls-ss-toggle">{open ? '▾' : '▸'}</div>
      </div>
      {open && (
        <div className="ls-ss-body">
          <div className="ls-ss-summary">{summary}</div>
          <div className="ls-ss-text">{children}</div>
          {plain && (
            <div className="ls-ss-plain">
              <div className="ls-ss-plain-label">{plainLabel || '✦ In plain English'}</div>
              <p>{plain}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── HOME PAGE ───────────────────────────────────────────────────────────────
function HomePage({ nav }) {
  return (
    <div className="ls-page">
      <div className="ls-hero">
        <div className="ls-hero-left">
          <div className="ls-hero-tag">
            <span className="dot" style={{ width: 6, height: 6, background: 'var(--gold)', borderRadius: '50%', display: 'inline-block' }}></span>
            AI-Powered Legal Clarity
          </div>
          <h1 className="ls-hero-title">
            Legal documents,<br />
            <em>finally</em> in plain<br />
            English.
          </h1>
          <p className="ls-hero-subtitle">
            Upload any contract, lease, or legal agreement. LexSimple translates complex legal language into clear summaries anyone can understand — in seconds.
          </p>
          <div className="ls-hero-btns">
            <button className="ls-btn-primary" onClick={() => nav('upload')}>Upload a Document</button>
            <button className="ls-btn-secondary" onClick={() => nav('about')}>How it works</button>
          </div>
          <div className="ls-hero-stats">
            <div><div className="ls-stat-num">98%</div><div className="ls-stat-label">Accuracy rate</div></div>
            <div><div className="ls-stat-num">45k+</div><div className="ls-stat-label">Documents analyzed</div></div>
            <div><div className="ls-stat-num">12s</div><div className="ls-stat-label">Average analysis time</div></div>
          </div>
        </div>
        <div className="ls-hero-right">
          {[
            { icon: '📄', title: 'Plain-Language Summary', desc: "Every clause explained in simple, jargon-free language you'll actually understand." },
            { icon: '⚠️', title: 'Risk Highlighting', desc: 'Automatically flags concerning clauses, hidden fees, and unusual terms.' },
            { icon: '📅', title: 'Key Dates & Obligations', desc: 'Extracts deadlines, renewal dates, and important obligations in one place.' },
            { icon: '🔒', title: 'Bank-Grade Security', desc: 'Your documents are encrypted and never stored beyond your session.' },
          ].map(c => (
            <div className="ls-feature-card" key={c.title}>
              <div className="ls-feature-icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="ls-section" style={{ background: 'var(--white)' }}>
        <div className="ls-section-header">
          <div className="ls-section-label">What We Simplify</div>
          <h2 className="ls-section-title">Every legal document,<br /><em>decoded</em></h2>
          <p className="ls-section-sub">From NDAs to rental agreements — LexSimple handles all common legal document types with high accuracy and nuance.</p>
        </div>
        <div className="ls-features-grid">
          {[
            ['01', 'Rental & Lease Agreements', 'Understand your tenant rights, maintenance obligations, and what you\'re agreeing to before signing.'],
            ['02', 'Employment Contracts', 'Know your non-compete clauses, termination terms, and compensation details clearly.'],
            ['03', 'NDAs & Confidentiality', "See exactly what you're agreeing to keep secret and for how long."],
            ['04', 'Terms of Service', 'Finally know what apps and websites are doing with your data before you click "agree."'],
            ['05', 'Purchase Agreements', 'Understand property or asset purchase contracts before you commit to anything.'],
            ['06', 'Partnership & Shareholder', 'Decode equity splits, voting rights, and exit clauses in startup or business agreements.'],
          ].map(([num, title, desc]) => (
            <div className="ls-feat-item" key={num}>
              <div className="ls-feat-num">{num}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="ls-how-section">
        <div className="ls-section-header">
          <div className="ls-section-label" style={{ color: 'var(--gold)' }}>The Process</div>
          <h2 className="ls-section-title">Three steps to<br /><em>total clarity</em></h2>
          <p className="ls-section-sub">No legal background needed. No hours of reading required. Just upload and understand.</p>
        </div>
        <div className="ls-steps-row">
          {[
            ['1', 'Upload Your Document', 'PDF, Word, or plain text — any format works. Drag and drop it in.'],
            ['2', 'AI Analyzes', 'Our legal AI reads and processes every clause in under 15 seconds.'],
            ['3', 'Read Plain English', 'Get a structured summary, risk flags, and key dates you can actually use.'],
          ].map(([n, title, desc]) => (
            <div className="ls-step" key={n}>
              <div className="ls-step-circle">{n}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer nav={nav} />
    </div>
  );
}

// ─── AUTH PAGE ────────────────────────────────────────────────────────────────
function AuthPage({ nav, onLogin }) {
  const [tab, setTab] = useState('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupFirst, setSignupFirst] = useState('');
  const [signupLast, setSignupLast] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  async function handleLogin() {
    if (!loginEmail || !loginPassword) return onLogin(null, 'Please enter email and password.');
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) return onLogin(null, data.error || 'Login failed.');
      localStorage.setItem('lexsimple_token', data.token);
      localStorage.setItem('lexsimple_user', JSON.stringify(data.user));
      onLogin(data, `Welcome back, ${data.user.name}!`);
      setTimeout(() => nav('upload'), 1000);
    } catch {
      onLogin(null, 'Cannot reach server. Is the backend running?');
    }
  }

  async function handleSignup() {
    const name = `${signupFirst} ${signupLast}`.trim();
    if (!name || !signupEmail || !signupPassword) return onLogin(null, 'Please fill in all fields.');
    try {
      const res = await fetch(`${API}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: signupEmail, password: signupPassword }),
      });
      const data = await res.json();
      if (!res.ok) return onLogin(null, data.error || 'Signup failed.');
      localStorage.setItem('lexsimple_token', data.token);
      localStorage.setItem('lexsimple_user', JSON.stringify(data.user));
      onLogin(data, `Welcome to LexSimple, ${data.user.name}!`);
      setTimeout(() => nav('upload'), 1000);
    } catch {
      onLogin(null, 'Cannot reach server. Is the backend running?');
    }
  }

  return (
    <div className="ls-page">
      <div className="ls-auth-page">
        <div className="ls-auth-container">
          <div className="ls-auth-panel left">
            <div>
              <h2>Understand <em>every</em> contract you ever sign.</h2>
              <p>Join thousands of people who've stopped blindly signing legal documents. LexSimple puts the power back in your hands.</p>
            </div>
            <div className="ls-auth-testimonial">
              <blockquote>"I finally understood my employment contract before signing. Found a non-compete clause that would've cost me my next job."</blockquote>
              <div className="attr">— Priya M., Software Engineer</div>
            </div>
          </div>
          <div className="ls-auth-panel">
            <div className="ls-auth-tabs">
              <button className={`ls-auth-tab${tab === 'login' ? ' active' : ''}`} onClick={() => setTab('login')}>Sign In</button>
              <button className={`ls-auth-tab${tab === 'signup' ? ' active' : ''}`} onClick={() => setTab('signup')}>Create Account</button>
            </div>

            {tab === 'login' ? (
              <div className="ls-auth-form">
                <h3>Welcome back</h3>
                <div className="ls-form-group"><label>Email address</label><input type="email" placeholder="you@example.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} /></div>
                <div className="ls-form-group"><label>Password</label><input type="password" placeholder="••••••••" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} /></div>
                <button className="ls-form-submit" onClick={handleLogin}>Sign In</button>
                <div className="ls-form-divider"><span>or continue with</span></div>
                <div style={{ display: 'flex', gap: 10, flexDirection: 'column' }}>
                  <button className="ls-social-btn" onClick={() => window.location.href = 'http://localhost:5000/auth/google'}><GoogleIcon /> Continue with Google</button>
                  <button className="ls-social-btn" onClick={() => window.location.href = 'http://localhost:5000/auth/github'}><GitHubIcon /> Continue with GitHub</button>
                </div>
              </div>
            ) : (
              <div className="ls-auth-form">
                <h3>Create your account</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="ls-form-group"><label>First name</label><input type="text" placeholder="Jane" value={signupFirst} onChange={e => setSignupFirst(e.target.value)} /></div>
                  <div className="ls-form-group"><label>Last name</label><input type="text" placeholder="Doe" value={signupLast} onChange={e => setSignupLast(e.target.value)} /></div>
                </div>
                <div className="ls-form-group"><label>Email address</label><input type="email" placeholder="you@example.com" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} /></div>
                <div className="ls-form-group"><label>Create password</label><input type="password" placeholder="Minimum 8 characters" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} /></div>
                <button className="ls-form-submit" onClick={handleSignup}>Create Account</button>
                <div className="ls-form-divider"><span>or sign up with</span></div>
                <div style={{ display: 'flex', gap: 10, flexDirection: 'column' }}>
                  <button className="ls-social-btn" onClick={() => window.location.href = 'http://localhost:5000/auth/google'}><GoogleIcon /> Continue with Google</button>
                  <button className="ls-social-btn" onClick={() => window.location.href = 'http://localhost:5000/auth/github'}><GitHubIcon /> Continue with GitHub</button>
                </div>
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

// ─── UPLOAD PAGE ──────────────────────────────────────────────────────────────
function UploadPage({ nav, authToken, showToast, onAnalysisComplete }) {
  const [currentFile, setCurrentFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStep, setProgressStep] = useState('');
  const fileInputRef = useRef();

  const options = [
    { label: 'Plain-language summary', defaultChecked: true, value: 'summary' },
    { label: 'Risk & flag detection', defaultChecked: true, value: 'risks' },
    { label: 'Key dates extraction', defaultChecked: true, value: 'dates' },
    { label: 'Party obligations', defaultChecked: true, value: 'obligations' },
    { label: 'Comparison with templates', defaultChecked: false, value: 'comparison' },
    { label: 'Export formatted report', defaultChecked: false, value: 'export' },
  ];
  const [checkedOptions, setCheckedOptions] = useState(
    options.reduce((acc, o) => ({ ...acc, [o.value]: o.defaultChecked }), {})
  );

  function displayFile(file) {
    setCurrentFile(file);
    showToast('File ready: ' + file.name);
  }

  function removeFile() {
    setCurrentFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast('File removed.');
  }

  function getFileDisplay(file) {
    const size = file.size < 1024 * 1024
      ? (file.size / 1024).toFixed(1) + ' KB'
      : (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    const ext = file.name.split('.').pop().toUpperCase();
    const icons = { PDF: '📄', DOCX: '📝', DOC: '📝', TXT: '📃' };
    return { size, ext, icon: icons[ext] || '📄' };
  }

  async function startAnalysis() {
    if (!currentFile) return showToast('Please upload a file first.');
    if (!authToken) {
      showToast('Please log in to analyse documents.');
      setTimeout(() => nav('auth'), 1000);
      return;
    }

    const fakeSteps = [
      [20, 'Extracting text from document...'],
      [40, 'Identifying clauses and sections...'],
      [60, 'Running legal language model...'],
      [80, 'Flagging risks and obligations...'],
    ];

    setAnalyzing(true);
    setProgress(0);
    let si = 0;
    const fakeTimer = setInterval(() => {
      if (si < fakeSteps.length) {
        setProgress(fakeSteps[si][0]);
        setProgressStep(fakeSteps[si][1]);
        si++;
      }
    }, 1200);

    try {
      const selectedOptions = Object.entries(checkedOptions).filter(([, v]) => v).map(([k]) => k);
      const formData = new FormData();
      formData.append('document', currentFile);
      formData.append('options', JSON.stringify(selectedOptions));

      const res = await fetch(`${API}/analyze`, {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + authToken },
        body: formData,
      });

      clearInterval(fakeTimer);
      const data = await res.json();

      if (!res.ok) {
        setAnalyzing(false);
        return showToast(data.error || 'Analysis failed.');
      }

      setProgress(100);
      setProgressStep('Analysis complete!');
      setTimeout(() => {
        setAnalyzing(false);
        onAnalysisComplete(data);
        nav('summary');
      }, 700);
    } catch {
      clearInterval(fakeTimer);
      setAnalyzing(false);
      showToast('Cannot reach server. Is the backend running?');
    }
  }

  return (
    <div className="ls-page">
      <div className="ls-upload-page">
        <h1>Upload your <em>document</em></h1>
        <p>We'll analyze it and give you a clear, plain-English breakdown of everything inside.</p>

        <div
          className={`ls-dropzone${isDragging ? ' drag' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={e => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) displayFile(f); }}
        >
          <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.txt" style={{ display: 'none' }} onChange={e => { const f = e.target.files[0]; if (f) displayFile(f); }} />
          <span className="ls-dropzone-icon">📂</span>
          <h3>Drag &amp; drop your legal document here</h3>
          <p>or <span className="ls-browse-link">browse to upload</span></p>
          <div className="ls-file-types">
            {['PDF', 'DOCX', 'DOC', 'TXT', 'Up to 25MB'].map(t => <span className="ls-file-type-badge" key={t}>{t}</span>)}
          </div>
        </div>

        {currentFile && (() => {
          const { size, ext, icon } = getFileDisplay(currentFile);
          return (
            <div className="ls-uploaded-file">
              <div className="ls-file-icon">{icon}</div>
              <div className="ls-file-info">
                <div className="ls-file-name">{currentFile.name}</div>
                <div className="ls-file-size">{size} · {ext}</div>
              </div>
              <button className="ls-file-remove" onClick={removeFile}>✕</button>
            </div>
          );
        })()}

        <div className="ls-analyze-options">
          <h3>Analysis options</h3>
          <div className="ls-options-grid">
            {options.map(o => (
              <label className="ls-option-check" key={o.value}>
                <input type="checkbox" checked={!!checkedOptions[o.value]} onChange={e => setCheckedOptions(prev => ({ ...prev, [o.value]: e.target.checked }))} />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="ls-analyze-btn-wrap">
          <button className="ls-analyze-btn" disabled={!currentFile} onClick={startAnalysis}>
            Analyze Document <span>→</span>
          </button>
        </div>
      </div>

      {/* Progress Overlay */}
      {analyzing && (
        <div className="ls-progress-overlay show">
          <div className="ls-progress-box">
            <h3>Analyzing your document</h3>
            <p>Our AI is reading every clause carefully...</p>
            <div className="ls-progress-bar-wrap">
              <div className="ls-progress-bar-fill" style={{ width: progress + '%' }}></div>
            </div>
            <div className="ls-progress-step-label">{progressStep}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SUMMARY PAGE ─────────────────────────────────────────────────────────────
function SummaryPage({ nav, analysisData }) {
  return (
    <div className="ls-page">
      <div className="ls-summary-page">
        <div className="ls-summary-header">
          <h1>Document <em>Summary</em></h1>
          <p>{analysisData
            ? `${analysisData.docType || 'Legal Document'} · Parties: ${(analysisData.parties || []).join(' & ')}`
            : 'Employment Contract — TechCorp India Pvt. Ltd. · Analyzed March 31, 2026 · 12 pages · 4,200 words'
          }</p>
        </div>

        <div className="ls-summary-layout">
          {/* Sidebar */}
          <div className="ls-summary-sidebar">
            <div className="ls-sidebar-card">
              <h4>Risk Assessment</h4>
              {(analysisData?.risks || [
                { level: 'high', label: 'Non-compete clause' },
                { level: 'medium', label: 'Termination notice' },
                { level: 'low', label: 'Probation period' },
              ]).map(r => (
                <div className="ls-risk-item" key={r.label}>
                  <div className={`ls-risk-dot ${r.level}`}></div>
                  <span className="ls-risk-label">{r.label}</span>
                  <span className={`ls-risk-badge ${r.level}`}>{r.level}</span>
                </div>
              ))}
            </div>

            <div className="ls-sidebar-card">
              <h4>Clarity Score</h4>
              {[
                { label: 'Readability', pct: 72, cls: 'amber' },
                { label: 'Fairness', pct: 55, cls: 'amber' },
                { label: 'Completeness', pct: 88, cls: 'green' },
              ].map(s => (
                <div className="ls-score-bar-wrap" key={s.label}>
                  <div className="ls-score-label"><span>{s.label}</span><span>{s.pct}%</span></div>
                  <div className="ls-score-bar"><div className={`ls-score-fill ${s.cls}`} style={{ width: s.pct + '%' }}></div></div>
                </div>
              ))}
            </div>

            <div className="ls-sidebar-card">
              <h4>Key Dates</h4>
              {(analysisData?.dates || [
                { label: 'Start Date', date: 'April 15, 2026' },
                { label: 'Probation Ends', date: 'July 15, 2026' },
                { label: 'Notice Period', date: '90 days' },
              ]).map(d => (
                <div key={d.label} style={{ padding: '8px 0', borderBottom: '1px solid var(--parchment-3)' }}>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.04em' }}>{d.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', marginTop: 2 }}>{d.date}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="ls-summary-main">
            <SummarySection
              icon="📋" title="Plain-English Overview" badge="Summary"
              summary="This is a standard employment contract with some clauses that need attention before you sign."
            >
              <p>{analysisData?.summary || "The contract follows a typical structure for a mid-level software engineering role. Compensation and benefits are clearly stated. However, two clauses — the non-compete agreement and the IP ownership clause — are broader than industry standard and could affect you significantly after you leave the role."}</p>
            </SummarySection>

            <SummarySection
              icon="⚠️" title="Non-Compete Clause" badge="High Risk"
              summary="You cannot work for any direct competitor or start a similar business for 12 months after leaving — regardless of the reason you leave."
              plain="If you leave this job — for any reason — you legally can't join a tech company that does anything similar for 1 year. In practice, this would be hard to enforce in India, but it could still cause problems. Consider negotiating this down to 6 months or asking them to narrow what 'competitor' means."
              plainLabel="⚠️ What this means for you"
            >
              <p>Section 8.3 of the contract contains a broad non-compete agreement covering any company that "offers similar software development services or products." This is intentionally wide and could prevent you from joining many companies in the tech sector.</p>
              <p>The clause applies even if you are laid off, and the geographic scope is listed as "India and internationally" — which is unusually broad.</p>
            </SummarySection>

            <SummarySection
              icon="💡" title="Intellectual Property" badge="Review"
              summary="Everything you build during employment — even on personal time — may belong to the company."
              plain="That side project app you're building on weekends? The contract as written says it belongs to TechCorp. If you want to protect personal projects, ask them to add an exclusion clause for work done on your own time, without company resources."
            >
              <p>Section 7 assigns all intellectual property created "during the period of employment" to TechCorp. The clause does not distinguish between work done on company time vs. personal projects.</p>
            </SummarySection>

            <SummarySection
              icon="✅" title="Salary & Benefits" badge="Clear"
              summary="Your compensation is clearly stated and in line with industry standards for this role."
              plain="You'll take home about ₹1.5L per month. The bonus isn't guaranteed — it depends on your performance score. The benefits are solid and clearly described, so no surprises here."
            >
              <p>Base salary: ₹18,00,000 per annum, paid monthly. Includes ₹2L variable bonus tied to performance reviews conducted annually in March.</p>
              <p>Benefits include: health insurance (self + family), 21 days paid leave, 10 public holidays, work-from-home 2 days/week.</p>
            </SummarySection>

            <div className="ls-export-row">
              <button className="ls-export-btn primary-export">⬇ Download PDF Report</button>
              <button className="ls-export-btn">📋 Copy Summary</button>
              <button className="ls-export-btn" onClick={() => nav('upload')}>📄 Analyze Another</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────
function AboutPage({ nav }) {
  return (
    <div className="ls-page">
      <div className="ls-about-page">
        <div className="ls-about-hero">
          <div>
            <h1>We believe <em>everyone</em> deserves to understand what they sign.</h1>
            <p>LexSimple was built out of frustration — the kind you feel when a landlord shoves a 20-page lease at you and says "just sign here." Legal documents shouldn't require a law degree to understand. We're fixing that.</p>
            <br />
            <p>Founded in 2024, we've helped over 45,000 people understand their contracts, leases, employment agreements, and more — before they signed them.</p>
            <br />
            <button className="ls-btn-primary" onClick={() => nav('upload')}>Try It Now</button>
          </div>
          <div className="ls-about-visual">
            {[
              ['45,000+', 'Documents simplified for everyday people across India'],
              ['₹0', 'Cost to analyze your first 3 documents — free forever'],
              ['12 sec', 'Average time from upload to full plain-English summary'],
            ].map(([num, desc]) => (
              <div className="ls-mission-stat" key={num}>
                <div className="ls-mission-num">{num}</div>
                <div className="ls-mission-desc">{desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="ls-values-grid">
          {[
            ['🔍', 'Radical Transparency', "We tell you exactly what we find — the good and the concerning. No sugarcoating, no legal hedging."],
            ['🔒', 'Privacy First', "Your documents are never stored after analysis. We process, summarize, and delete. Full stop."],
            ['⚖️', 'Not Legal Advice', "We're AI, not lawyers. We help you understand documents — for serious decisions, always consult a professional."],
          ].map(([icon, title, desc]) => (
            <div className="ls-value-card" key={title}>
              <div className="val-icon">{icon}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>

        <div className="ls-team-section">
          <h2>The team behind LexSimple</h2>
          <p>A small team of engineers, lawyers, and designers who care deeply about legal literacy.</p>
          <div className="ls-team-grid">
            {[
              { initial: 'G', name: 'Gyandeep Kumar', role: 'Founder & CEO', bg: '#f5edd8' },
              { initial: 'J', name: 'Juneth', role: 'Head of Legal AI', bg: '#e8f5e9' },
              { initial: 'N', name: 'Nitin Tiwari', role: 'Lead Engineer', bg: '#e8eaf6' },
              { initial: 'S', name: 'Somesh Pandey', role: 'Product Designer', bg: '#fce4ec' },
            ].map(m => (
              <div className="ls-team-card" key={m.name}>
                <div className="ls-team-avatar" style={{ background: m.bg }}>{m.initial}</div>
                <h4>{m.name}</h4>
                <p>{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CONTACT PAGE ─────────────────────────────────────────────────────────────
function ContactPage({ showToast }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleContact() {
    if (!name || !email) return showToast('Please fill in your name and email.');
    try {
      const res = await fetch(`${API}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json();
      if (!res.ok) return showToast(data.error || 'Failed to send.');
      setSuccess(true);
      showToast('Message sent!');
      setTimeout(() => { setName(''); setEmail(''); setSubject(''); setMessage(''); }, 2000);
    } catch {
      showToast('Cannot reach server. Is the backend running?');
    }
  }

  return (
    <div className="ls-page">
      <div className="ls-contact-page" style={{ paddingTop: 120 }}>
        <div className="ls-contact-left">
          <h1>Let's <em>talk</em></h1>
          <p>Have a question about a document type, a billing issue, or just want to share feedback? We read every message and reply within one business day.</p>
          <div className="ls-contact-info">
            {[
              ['✉️', 'Email', 'hello@lexsimple.in'],
              ['📍', 'Office', 'mera flat'],
              ['🕐', 'Response time', 'lunch ke baad aana'],
            ].map(([icon, title, val]) => (
              <div className="ls-contact-item" key={title}>
                <div className="ls-contact-item-icon">{icon}</div>
                <div><h4>{title}</h4><p>{val}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="ls-contact-form">
          <h2>Send us a message</h2>
          <div className="ls-form-group"><label>Your name</label><input type="text" placeholder="Modi" value={name} onChange={e => setName(e.target.value)} /></div>
          <div className="ls-form-group"><label>Email address</label><input type="email" placeholder="Modi@example.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div className="ls-form-group"><label>Subject</label><input type="text" placeholder="Question about a document type..." value={subject} onChange={e => setSubject(e.target.value)} /></div>
          <div className="ls-form-group"><label>Message</label><textarea placeholder="Tell us how we can help..." value={message} onChange={e => setMessage(e.target.value)} /></div>
          <button className="ls-form-submit" onClick={handleContact}>Send Message</button>
          <div className={`ls-success-msg${success ? ' show' : ''}`}>
            <span>✅</span><span>Message sent! We'll get back to you after lunch.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({ nav }) {
  return (
    <footer className="ls-footer">
      <div className="ls-footer-grid">
        <div>
          <div className="ls-footer-logo">
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }}></span>
            LexSimple
          </div>
          <div className="ls-footer-col">
            <p>Demystifying legal language for everyone. Built with care for people who deserve to understand what they sign.</p>
          </div>
        </div>
        <div className="ls-footer-col">
          <h4>Product</h4>
          <a onClick={() => nav('upload')}>Upload Document</a>
          <a onClick={() => nav('summary')}>View Summary</a>
          <a>Pricing</a>
          <a>API Access</a>
        </div>
        <div className="ls-footer-col">
          <h4>Company</h4>
          <a onClick={() => nav('about')}>About</a>
          <a>Blog</a>
          <a>Careers</a>
          <a onClick={() => nav('contact')}>Contact</a>
        </div>
        <div className="ls-footer-col">
          <h4>Legal</h4>
          <a>Privacy Policy</a>
          <a>Terms of Use</a>
          <a>Security</a>
          <a>Disclaimer</a>
        </div>
      </div>
      <div className="ls-footer-bottom">
        <p>© 2026 LexSimple. Not a substitute for legal advice.</p>
        <p style={{ fontSize: 12, color: 'var(--ink-3)' }}>Built with ♥ for clarity</p>
      </div>
    </footer>
  );
}

// ─── ROOT COMPONENT ──────────────────────────────────────────────────────────
export default function LexSimple() {
  const [page, setPage] = useState('home');
  const [toast, setToast] = useState({ msg: '', show: false });
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('lexsimple_token'));
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('lexsimple_user') || 'null'));
  const [analysisData, setAnalysisData] = useState(null);


  const toastTimer = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const name = params.get('name');
    if (token) {
      localStorage.setItem('lexsimple_token', token);
      localStorage.setItem('lexsimple_user', JSON.stringify({ name }));
      setAuthToken(token);
      setCurrentUser({ name });
      window.history.replaceState({}, '', '/');
      nav('upload');
    }
  }, []);

  function showToast(msg) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, show: true });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  }

  function nav(p) {
    setPage(p);
    window.scrollTo(0, 0);
  }

  function handleLogin(data, toastMsg) {
    if (data) {
      setAuthToken(data.token);
      setCurrentUser(data.user);
    }
    showToast(toastMsg);
  }

  function handleLogout() {
    setAuthToken(null);
    setCurrentUser(null);
    localStorage.removeItem('lexsimple_token');
    localStorage.removeItem('lexsimple_user');
    showToast('Logged out.');
    nav('home');
  }

  const navItems = [
    { key: 'home', label: 'Home' },
    { key: 'auth', label: currentUser ? currentUser.name.split(' ')[0] : 'Login' },
    { key: 'upload', label: 'Upload' },
    { key: 'summary', label: 'Summary' },
    { key: 'about', label: 'About' },
    { key: 'contact', label: 'Contact' },
  ];

  return (
    <div className="lexsimple-root">
      {/* NAV */}
      <nav className="ls-nav">
        <button className="ls-nav-logo" onClick={() => nav('home')}>
          <span className="dot"></span>LexSimple
        </button>
        <div className="ls-nav-links">
          {navItems.map(item => (
            <button
              key={item.key}
              className={page === item.key ? 'active' : ''}
              onClick={() => item.key === 'auth' && currentUser ? handleLogout() : nav(item.key)}
            >
              {item.label}
            </button>
          ))}
          {!currentUser && (
            <button className="ls-nav-cta" onClick={() => nav('auth')}>Get Started</button>
          )}
        </div>
      </nav>

      {/* PAGES */}
      {page === 'home' && <HomePage nav={nav} />}
      {page === 'auth' && <AuthPage nav={nav} onLogin={handleLogin} />}
      {page === 'upload' && <UploadPage nav={nav} authToken={authToken} showToast={showToast} onAnalysisComplete={setAnalysisData} />}
      {page === 'summary' && <SummaryPage nav={nav} analysisData={analysisData} />}
      {page === 'about' && <AboutPage nav={nav} />}
      {page === 'contact' && <ContactPage showToast={showToast} />}

      {/* TOAST */}
      <div className={`ls-toast${toast.show ? ' show' : ''}`}>{toast.msg}</div>
    </div>
  );
}
