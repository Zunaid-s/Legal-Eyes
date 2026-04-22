import { useNavigate } from 'react-router-dom';
import SummarySection from '../components/SummarySection';

export default function Summary({ analysisData }) {
  const navigate = useNavigate();

  const risks = analysisData?.risks || [
    { level: 'high', label: 'Non-compete clause' },
    { level: 'medium', label: 'Termination notice' },
    { level: 'low', label: 'Probation period' },
  ];

  const dates = analysisData?.dates || [
    { label: 'Start Date', date: 'April 15, 2026' },
    { label: 'Probation Ends', date: 'July 15, 2026' },
    { label: 'Notice Period', date: '90 days' },
  ];

  const scores = [
    { label: 'Readability', pct: 72, cls: 'amber' },
    { label: 'Fairness', pct: 55, cls: 'amber' },
    { label: 'Completeness', pct: 88, cls: 'green' },
  ];

  return (
    <div className="ls-page">
      <div className="ls-summary-page">

        <div className="ls-summary-header">
          <h1>Document <em>Summary</em></h1>
          <p>
            {analysisData
              ? `${analysisData.docType || 'Legal Document'} · Parties: ${(analysisData.parties || []).join(' & ')}`
              : 'Employment Contract — TechCorp India Pvt. Ltd. · Analyzed March 31, 2026 · 12 pages · 4,200 words'
            }
          </p>
        </div>

        <div className="ls-summary-layout">

          {/* Sidebar */}
          <div className="ls-summary-sidebar">

            <div className="ls-sidebar-card">
              <h4>Risk Assessment</h4>
              {risks.map(r => (
                <div className="ls-risk-item" key={r.label}>
                  <div className={`ls-risk-dot ${r.level}`}></div>
                  <span className="ls-risk-label">{r.label}</span>
                  <span className={`ls-risk-badge ${r.level}`}>{r.level}</span>
                </div>
              ))}
            </div>

            <div className="ls-sidebar-card">
              <h4>Clarity Score</h4>
              {scores.map(s => (
                <div className="ls-score-bar-wrap" key={s.label}>
                  <div className="ls-score-label"><span>{s.label}</span><span>{s.pct}%</span></div>
                  <div className="ls-score-bar">
                    <div className={`ls-score-fill ${s.cls}`} style={{ width: s.pct + '%' }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="ls-sidebar-card">
              <h4>Key Dates</h4>
              {dates.map(d => (
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
              <p>Section 8.3 of the contract contains a broad non-compete agreement covering any company that "offers similar software development services or products."</p>
              <p>The clause applies even if you are laid off, and the geographic scope is "India and internationally" — which is unusually broad.</p>
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
              <p>Base salary: ₹18,00,000 per annum, paid monthly. Includes ₹2L variable bonus tied to annual performance reviews.</p>
              <p>Benefits include: health insurance (self + family), 21 days paid leave, 10 public holidays, work-from-home 2 days/week.</p>
            </SummarySection>

            <div className="ls-export-row">
              <button className="ls-export-btn primary-export">⬇ Download PDF Report</button>
              <button className="ls-export-btn">📋 Copy Summary</button>
              <button className="ls-export-btn" onClick={() => navigate('/upload')}>📄 Analyze Another</button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
