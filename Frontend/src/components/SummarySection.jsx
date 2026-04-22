import { useState } from 'react';

export default function SummarySection({ icon, title, badge, summary, children, plain, plainLabel }) {
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
