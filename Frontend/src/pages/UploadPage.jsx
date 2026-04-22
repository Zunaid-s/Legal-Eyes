import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../services/api';

export default function UploadPage({ authToken, showToast, onAnalysisComplete }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleBoxClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentFile(file);
      showToast(`Selected: ${file.name}`);
    }
  };

  const startAnalysis = async () => {
  if (!currentFile) return;
  setAnalyzing(true);

  const formData = new FormData();
  
  // FIX: Key must be 'document' to match backend's upload.single('document')
  formData.append('document', currentFile); 

  try {
    // FIX: URL must match app.post('/api/v1/analyze', ...) in index.js
    const res = await axios.post(`${BASE_URL}/api/v1/analyze`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${authToken}` 
      }
    });

    onAnalysisComplete(res.data);
    showToast('Analysis complete!');
    navigate('/summary');
  } catch (err) {
    console.error("Analysis Error:", err);
    showToast(err.response?.data?.error || 'Analyze fail. Check backend logs.');
  } finally {
    setAnalyzing(false);
  }
};

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
      <header className="text-center space-y-2">
        <h1 className="font-serif text-4xl font-light text-base-content">
          Upload your <em className="text-primary italic">document</em>
        </h1>
        <p className="opacity-60 text-sm">Upload a contract or lease for an instant plain-English summary.</p>
      </header>

      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".pdf,.docx,.doc" 
      />

      {/* Analysis Loading Overlay */}
      {analyzing && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-base-100/90 backdrop-blur-sm">
          <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
          <h2 className="font-serif text-2xl italic">Analyzing Document...</h2>
          <p className="text-sm opacity-50">This may take up to 15 seconds.</p>
        </div>
      )}

      {/* Dropzone Area */}
      <div 
        onClick={handleBoxClick}
        className="border-2 border-dashed border-base-300 rounded-3xl p-16 text-center bg-base-200/50 hover:border-primary transition-all cursor-pointer group"
      >
        <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📂</div>
        <h3 className="text-lg font-medium">Drag & drop your document here</h3>
        <p className="text-sm opacity-50 mt-2">or <span className="text-primary underline font-medium">browse to upload</span></p>
        
        <div className="flex gap-2 justify-center mt-6">
          <div className="badge badge-outline opacity-40">PDF</div>
          <div className="badge badge-outline opacity-40">DOCX</div>
        </div>
      </div>

      {/* File Status & Analyze Button */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-base-200 rounded-2xl border border-base-300 shadow-sm">
        <div className="flex items-center gap-3 text-base-content">
          {currentFile ? (
            <>
              <span className="text-3xl">📄</span>
              <div>
                <p className="font-bold text-sm">{currentFile.name}</p>
                <p className="text-xs opacity-50">{(currentFile.size / 1024).toFixed(0)} KB</p>
              </div>
            </>
          ) : (
            <p className="text-sm opacity-50 italic">No file selected</p>
          )}
        </div>

        <button 
          onClick={startAnalysis}
          className={`btn btn-primary btn-wide shadow-lg ${(!currentFile || analyzing) ? 'btn-disabled opacity-50' : ''}`}
        >
          {analyzing ? 'Processing...' : 'Analyze Document →'}
        </button>
      </div>
    </div>
  );
}