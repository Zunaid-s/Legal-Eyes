import { useState, useEffect } from 'react';
import SummarySection from '../components/SummarySection';
import DocumentChat from '../components/DocumentChat';

export default function Summary({ analysisData, authToken }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [synth, setSynth] = useState(null);

  // Initialize Speech Synthesis
  useEffect(() => {
    setSynth(window.speechSynthesis);
    return () => window.speechSynthesis.cancel(); // Stop speaking if user leaves page
  }, []);

  if (!analysisData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const docId = analysisData.documentId || analysisData._id;
  const docName = analysisData.filename || analysisData.fileName || "Uploaded Document";

  const clauses = analysisData.problematicClauses || [];
  const exeSummary = clauses.length > 0 ? clauses.map(c => c.issueDescription).join('. ') : "No major issues found. Document looks clean.";
  const risksText = clauses.length > 0 ? clauses.map(c => c.futureLosses).filter(Boolean).join('. ') || "No significant long-term risks detected." : "No significant long-term risks detected.";
  const profitText = clauses.length > 0 ? clauses.map(c => c.futureBenefits).filter(Boolean).join('. ') || "Standard financial terms identified." : "Standard financial terms identified.";

  // Define the text the AI will read
  const textToRead = `
    Document Analysis for ${docName}. 
    Executive Summary: ${exeSummary}. 
    Future Risks: ${risksText}.
    Profit Opportunities: ${profitText}.
  `;

  const handleVoiceToggle = () => {
    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.9; // Slightly slower for legal clarity
      utterance.pitch = 1;

      utterance.onend = () => setIsSpeaking(false);
      synth.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto py-10 px-4 space-y-10">
      {/* --- Page Header with Voice Control --- */}
      <header className="flex flex-col md:flex-row justify-between items-end border-b border-base-300 pb-6 gap-4">
        <div>
          <h1 className="font-serif text-4xl font-light italic text-base-content">
            Analysis <span className="text-primary">Summary</span>
          </h1>
          <p className="text-sm opacity-60 mt-1">Reviewing: {docName}</p>
        </div>

        {/* AI Voice Assistant Button */}
        <button
          onClick={handleVoiceToggle}
          className={`btn btn-outline gap-2 ${isSpeaking ? 'btn-error animate-pulse' : 'btn-primary'}`}
        >
          {isSpeaking ? (
            <><span>Stop Assistant</span><div className="badge badge-sm">■</div></>
          ) : (
            <><span>Listen to Analysis</span><div className="badge badge-sm">▶</div></>
          )}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT COLUMN: Metrics (2 Cols) */}
        <aside className="lg:col-span-2 space-y-6">
          <div className="card bg-base-200 border border-base-300 p-5 shadow-sm text-center">
            <div className="avatar placeholder mb-2">
              <div className="bg-primary text-primary-content rounded-full w-12">
                <span>AI</span>
              </div>
            </div>
            <h4 className="text-[10px] uppercase tracking-widest font-bold opacity-50 text-primary">Voice Active</h4>
            <p className="text-[9px] opacity-40 mt-1">Natural Language Processing</p>
          </div>
        </aside>

        {/* CENTER COLUMN: Detailed Analysis (10 Cols) */}
        <main className="lg:col-span-10 space-y-6">
          {clauses.length === 0 ? (
            <div className="alert alert-success shadow-sm">
              <span>No major problematic clauses found. The document looks clean!</span>
            </div>
          ) : (
            clauses.map((clause, index) => (
              <div key={index} className="card bg-base-200 border border-base-300 shadow-sm p-6 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="badge badge-primary badge-outline text-xs whitespace-nowrap">Clause {index + 1}</div>
                  <div className={`badge ${clause.severity === 'HIGH' ? 'badge-error' : clause.severity === 'MEDIUM' ? 'badge-warning' : 'badge-info'} text-xs`}>
                    {clause.severity || 'LOW'}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold opacity-50 uppercase tracking-wider mb-1">Original Text</h4>
                  <p className="text-sm font-serif italic border-l-2 border-primary pl-3 opacity-80">"{clause.originalClause}"</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold opacity-50 uppercase tracking-wider mb-1">The Issue</h4>
                  <p className="text-sm">{clause.issueDescription}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold opacity-50 uppercase tracking-wider mb-1">Recommendation</h4>
                  <p className="text-sm text-primary">{clause.suggestion}</p>
                </div>

                {clause.futureLosses && clause.futureLosses.trim() !== "" && (
                  <div className="p-3 rounded-xl border border-error bg-base-100 mt-2">
                    <h4 className="text-xs font-bold text-error uppercase tracking-wider mb-1 flex items-center gap-2">
                      <span>⚠️</span> Potential Risk
                    </h4>
                    <p className="text-sm text-error">{clause.futureLosses}</p>
                  </div>
                )}

                {clause.futureBenefits && clause.futureBenefits.trim() !== "" && (
                  <div className="p-3 rounded-xl border border-success bg-base-100 mt-2">
                    <h4 className="text-xs font-bold text-success uppercase tracking-wider mb-1 flex items-center gap-2">
                      <span>💡</span> Profit & Savings Opportunity
                    </h4>
                    <p className="text-sm text-success">{clause.futureBenefits}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </main>
      </div>

      {/* Floating Document Chat */}
      <DocumentChat documentId={docId} authToken={authToken} showToast={(msg) => console.log(msg)} />
    </div>
  );
}