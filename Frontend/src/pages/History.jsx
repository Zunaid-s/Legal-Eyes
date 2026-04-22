import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../services/api';

const CARDS_PER_PAGE = 4;

export default function History({ authToken, onLoadSummary }) {
  const navigate = useNavigate();
  const [docs, setDocs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchHistory = async () => {
    setLoading(true);
    try {
      // FIX: Ensure this matches where you mounted documentRoutes in index.js
      // If index.js has: app.use('/api/v1/documents', documentRoutes)
      const res = await axios.get(`${BASE_URL}/api/v1/documents`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setDocs(res.data);
    } catch (err) {
      console.error("History fetch error:", err);
    } finally {
      setLoading(false);
    }
  };
  if (authToken) fetchHistory();
}, [authToken]);

  

  const totalPages = Math.ceil(docs.length / CARDS_PER_PAGE);
  const currentDocs = docs.slice((page - 1) * CARDS_PER_PAGE, page * CARDS_PER_PAGE);

  const handleView = (doc) => {
    onLoadSummary(doc);
    navigate('/summary');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-10 text-base-content">
      <header className="text-center space-y-2">
        <h1 className="font-serif text-4xl font-light">Document <em className="text-primary italic">History</em></h1>
        <p className="opacity-60 text-sm">Review your previously analyzed legal documents.</p>
      </header>

      {docs.length === 0 ? (
        <div className="text-center py-20 bg-base-200 rounded-3xl border border-base-300">
          <p className="opacity-50 italic">No documents found in your history.</p>
          <button onClick={() => navigate('/upload')} className="btn btn-primary mt-4">Upload First Document</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentDocs.map((doc) => (
              <div key={doc._id} className="card bg-base-200 border border-base-300 shadow-sm hover:border-primary transition-all p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-serif text-xl font-medium">{doc.fileName || 'Untitled Document'}</h3>
                    <p className="text-xs opacity-50">
                      {new Date(doc.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className={`badge ${doc.overallRisk === 'high' ? 'badge-error' : doc.overallRisk === 'medium' ? 'badge-warning' : 'badge-success'} badge-sm`}>
                    {doc.overallRisk?.toUpperCase() || 'LOW'}
                  </div>
                </div>
                
                <p className="text-sm opacity-70 line-clamp-2 mb-6">
                  {doc.summary || 'Click view to see the full analysis of this document.'}
                </p>

                <div className="card-actions justify-end">
                  <button onClick={() => handleView(doc)} className="btn btn-ghost btn-sm text-primary">View Analysis →</button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10">
              <div className="join border border-base-300">
                <button 
                  className="join-item btn btn-sm bg-base-200" 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >«</button>
                <button className="join-item btn btn-sm bg-base-200">Page {page}</button>
                <button 
                  className="join-item btn btn-sm bg-base-200" 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >»</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}