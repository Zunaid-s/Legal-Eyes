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

  // Define the text the AI will read
  const textToRead = `
    Document Analysis for ${analysisData.fileName || 'your document'}. 
    Executive Summary: ${analysisData.summary}. 
    Future Risks: ${analysisData?.futureRisks || 'Standard long-term liabilities apply'}.
    Profit Opportunities: ${analysisData?.profitOpportunities || 'Optimization available via clause leverage'}.
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
          <p className="text-sm opacity-60 mt-1">Reviewing: {analysisData?.fileName || "Uploaded Document"}</p>
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

        {/* CENTER COLUMN: Detailed Analysis (6 Cols) */}
        <main className="lg:col-span-6 space-y-6">
          <SummarySection 
            icon="📄" title="Executive Summary" badge="Overview"
            summary={analysisData?.summary || "A high-level view of your rights."}
          />

          <SummarySection 
            icon="⏳" title="Future Risk Forecast" badge="Liability"
            summary={analysisData?.futureRisks || "No significant long-term risks detected."}
          />

          <SummarySection 
            icon="📈" title="Profit & Savings" badge="Growth"
            summary={analysisData?.profitOpportunities || "Standard financial terms identified."}
          />
        </main>

        {/* RIGHT COLUMN: AI Chatbox (4 Cols) */}
        <aside className="lg:col-span-4">
          <DocumentChat documentId={analysisData?._id} authToken={authToken} />
        </aside>
      </div>
    </div>
  );
}