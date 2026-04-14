import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../services/api';

const CARDS_PER_PAGE = 4;

const riskColor = {
  high:   { dot: '#e53e3e', badge: '#fff5f5', text: '#c53030', border: '#fed7d7' },
  medium: { dot: '#b8973a', badge: '#f5edd8', text: '#7d5a1e', border: '#f0d69a' },
  low:    { dot: '#38a169', badge: '#f0fff4', text: '#276749', border: '#c6f6d5' },
};

function HistoryCard({ doc, index, onView }) {
  const risk = doc.overallRisk || 'low';
  const colors = riskColor[risk] || riskColor.low;
  const date = doc.createdAt
    ? new Date(doc.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Unknown date';

  return (
    <div
      className="ls-history-card"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: 'var(--gold-pale)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, flexShrink: 0,
        }}>
          {doc.fileType === 'pdf' ? '📄' : doc.fileType === 'docx' ? '📝' : '📃'}
        </div>
        <span style={{
          fontSize: 11, fontWeight: 500, padding: '3px 10px',
          borderRadius: 12, border: `1px solid ${colors.border}`,
          background: colors.badge, color: colors.text,
          textTransform: 'capitalize',
        }}>
          {risk} risk
        </span>
      </div>

      {/* Doc name */}
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 18, fontWeight: 400, color: 'var(--ink)',
        marginBottom: 6, lineHeight: 1.3,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {doc.fileName || doc.docType || 'Legal Document'}
      </div>

      {/* Meta */}
      <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 16 }}>
        {doc.pages ? `${doc.pages} pages · ` : ''}{date}
      </div>

      {/* Summary snippet */}
      <p style={{
        fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.7,
        marginBottom: 20,
        display: '-webkit-box', WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {doc.summary || 'No summary available for this document.'}
      </p>

      {/* Risk dots */}
      {doc.risks?.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
          {doc.risks.slice(0, 3).map((r, i) => (
            <span key={i} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              fontSize: 11, color: 'var(--ink-3)',
              background: 'var(--parchment)', border: '1px solid var(--parchment-3)',
              borderRadius: 20, padding: '2px 10px',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: riskColor[r.level]?.dot || '#999', display: 'inline-block' }}></span>
              {r.label}
            </span>
          ))}
        </div>
      )}

      {/* View button */}
      <button
        onClick={() => onView(doc)}
        style={{
          width: '100%', padding: '10px',
          background: 'var(--ink)', color: 'var(--parchment)',
          border: 'none', borderRadius: 8,
          fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
          cursor: 'pointer', transition: 'background 0.2s',
        }}
        onMouseOver={e => e.currentTarget.style.background = 'var(--ink-2)'}
        onMouseOut={e => e.currentTarget.style.background = 'var(--ink)'}
      >
        View Summary →
      </button>
    </div>
  );
}

export default function History({ authToken, onLoadSummary }) {
  const navigate = useNavigate();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!authToken) {
      navigate('/auth');
      return;
    }
    fetchHistory();
  }, [authToken]);

  async function fetchHistory() {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/docshistory`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      // Support both { docs: [...] } and direct array response
      const data = Array.isArray(res.data) ? res.data : res.data.docs || res.data.history || [];
      setDocs(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load history. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleView(doc) {
    onLoadSummary(doc);
    navigate('/summary');
  }

  const totalPages = Math.ceil(docs.length / CARDS_PER_PAGE);
  const pageDocs = docs.slice((page - 1) * CARDS_PER_PAGE, page * CARDS_PER_PAGE);

  return (
    <div className="ls-page">
      <div style={{ padding: '80px 5vw', maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div className="ls-section-label">Your Documents</div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 300,
            color: 'var(--ink)', lineHeight: 1.1, marginBottom: 12,
          }}>
            Analysis <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>History</em>
          </h1>
          <p style={{ fontSize: 15, color: 'var(--ink-3)', maxWidth: 480 }}>
            All your previously analyzed documents in one place.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              border: '3px solid var(--parchment-3)',
              borderTop: '3px solid var(--gold)',
              margin: '0 auto 20px',
              animation: 'lsSpin 0.8s linear infinite',
            }}></div>
            <style>{`@keyframes lsSpin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ fontSize: 14, color: 'var(--ink-3)' }}>Loading your documents...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div style={{
            background: '#fff5f5', border: '1px solid #fed7d7',
            borderRadius: 12, padding: '20px 24px',
            color: '#c53030', fontSize: 14, marginBottom: 32,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{ fontSize: 20 }}>⚠️</span>
            <div>
              <div style={{ fontWeight: 500, marginBottom: 4 }}>Could not load history</div>
              <div>{error}</div>
            </div>
            <button
              onClick={fetchHistory}
              style={{
                marginLeft: 'auto', background: 'var(--ink)', color: 'var(--parchment)',
                border: 'none', borderRadius: 8, padding: '8px 18px',
                fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && docs.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '80px 20px',
            background: 'var(--white)', border: '1px solid var(--parchment-3)',
            borderRadius: 20,
          }}>
            <div style={{ fontSize: 52, marginBottom: 20 }}>📂</div>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 28, fontWeight: 300, color: 'var(--ink)', marginBottom: 10,
            }}>No documents yet</h3>
            <p style={{ fontSize: 14, color: 'var(--ink-3)', marginBottom: 28 }}>
              Upload your first legal document to get started.
            </p>
            <button className="ls-btn-primary" onClick={() => navigate('/upload')}>
              Upload a Document
            </button>
          </div>
        )}

        {/* Cards grid — 4 per page */}
        {!loading && !error && docs.length > 0 && (
          <>
            <div className="ls-history-grid">
              {pageDocs.map((doc, i) => (
                <HistoryCard key={doc._id || i} doc={doc} index={i} onView={handleView} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 8, marginTop: 40,
              }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    background: 'var(--white)', border: '1px solid var(--parchment-3)',
                    borderRadius: 8, padding: '8px 16px', cursor: 'pointer',
                    fontSize: 13, color: 'var(--ink-2)', fontFamily: "'DM Sans', sans-serif",
                    opacity: page === 1 ? 0.4 : 1,
                  }}
                >
                  ← Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    style={{
                      width: 36, height: 36, borderRadius: 8, border: '1px solid',
                      borderColor: page === i + 1 ? 'var(--gold)' : 'var(--parchment-3)',
                      background: page === i + 1 ? 'var(--gold)' : 'var(--white)',
                      color: page === i + 1 ? 'var(--ink)' : 'var(--ink-3)',
                      fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                      fontWeight: page === i + 1 ? 500 : 400,
                      cursor: 'pointer',
                    }}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{
                    background: 'var(--white)', border: '1px solid var(--parchment-3)',
                    borderRadius: 8, padding: '8px 16px', cursor: 'pointer',
                    fontSize: 13, color: 'var(--ink-2)', fontFamily: "'DM Sans', sans-serif",
                    opacity: page === totalPages ? 0.4 : 1,
                  }}
                >
                  Next →
                </button>
              </div>
            )}

            {/* Count */}
            <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--ink-3)', marginTop: 16 }}>
              Showing {(page - 1) * CARDS_PER_PAGE + 1}–{Math.min(page * CARDS_PER_PAGE, docs.length)} of {docs.length} documents
            </p>
          </>
        )}
      </div>
    </div>
  );
}
