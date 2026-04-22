import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="ls-page">

      {/* ── HERO ── */}
      <div className="ls-hero">
        <div className="ls-hero-left">
          <div className="ls-hero-tag">
            <span style={{ width: 6, height: 6, background: 'var(--gold)', borderRadius: '50%', display: 'inline-block' }}></span>
            AI-Powered Legal Clarity
          </div>
          <h1 className="ls-hero-title">
            Legal documents,<br />
            <em>finally</em> in plain<br />
            English.
          </h1>
          <p className="ls-hero-subtitle">
            Upload any contract, lease, or legal agreement. legal-eyes translates
            complex legal language into clear summaries anyone can understand — in seconds.
          </p>
          <div className="ls-hero-btns">
            <button className="ls-btn-primary" onClick={() => navigate('/upload')}>Upload a Document</button>
            <button className="ls-btn-secondary" onClick={() => navigate('/about')}>How it works</button>
          </div>
          <div className="ls-hero-stats">
            <div><div className="ls-stat-num">98%</div><div className="ls-stat-label">Accuracy rate</div></div>
            <div><div className="ls-stat-num">100+</div><div className="ls-stat-label">Documents analyzed</div></div>
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

      {/* ── FEATURES GRID ── */}
      <div className="ls-section" style={{ background: 'var(--white)' }}>
        <div className="ls-section-header">
          <div className="ls-section-label">What We Simplify</div>
          <h2 className="ls-section-title">Every legal document,<br /><em>decoded</em></h2>
          <p className="ls-section-sub">
            From NDAs to rental agreements — legal-eyes handles all common legal document
            types with high accuracy and nuance.
          </p>
        </div>
        <div className="ls-features-grid">
          {[
            ['01', 'Rental & Lease Agreements', "Understand your tenant rights, maintenance obligations, and what you're agreeing to before signing."],
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

      {/* ── HOW IT WORKS ── */}
      <div className="ls-how-section">
        <div className="ls-section-header">
          <div className="ls-section-label" style={{ color: 'var(--gold)' }}>The Process</div>
          <h2 className="ls-section-title">Three steps to<br /><em>total clarity</em></h2>
          <p className="ls-section-sub">
            No legal background needed. No hours of reading required. Just upload and understand.
          </p>
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

      <Footer />
    </div>
  );
}
