import { useNavigate } from 'react-router-dom';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="ls-page">
      <div className="ls-about-page">

        {/* Hero */}
        <div className="ls-about-hero">
          <div>
            <h1>We believe <em>everyone</em> deserves to understand what they sign.</h1>
            <p>legal-eyes was built out of frustration — the kind you feel when a landlord shoves a 20-page lease at you and says "just sign here." Legal documents shouldn't require a law degree to understand. We're fixing that.</p>
            <br />
            <p>Founded in 2024, we've helped many people understand their contracts, leases, employment agreements, and more — before they signed them.</p>
            <br />
            <button className="ls-btn-primary" onClick={() => navigate('/upload')}>Try It Now</button>
          </div>
          <div className="ls-about-visual">
            {[
              [, 'Documents simplified for everyday people across India'],
              [, 'Cost to analyze your documents — free forever'],
              [, 'Average time from upload to full plain-English summary is 12 sec'],
            ].map(([num, desc]) => (
              <div className="ls-mission-stat" key={num}>
                <div className="ls-mission-num">{num}</div>
                <div className="ls-mission-desc">{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
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

        {/* Team */}
        <div className="ls-team-section">
          <h2>The team behind Legal-eyes</h2>
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
