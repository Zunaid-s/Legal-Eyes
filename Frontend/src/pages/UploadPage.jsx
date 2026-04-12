import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const API = 'https://legal-ai-livid-six.vercel.app';

const ANALYSIS_OPTIONS = [
  { label: 'Plain-language summary', value: 'summary', defaultChecked: true },
  { label: 'Risk & flag detection', value: 'risks', defaultChecked: true },
  { label: 'Key dates extraction', value: 'dates', defaultChecked: true },
  { label: 'Party obligations', value: 'obligations', defaultChecked: true },
  { label: 'Comparison with templates', value: 'comparison', defaultChecked: false },
  { label: 'Export formatted report', value: 'export', defaultChecked: false },
];

export default function UploadPage({ authToken, showToast, onAnalysisComplete }) {
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const [currentFile, setCurrentFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStep, setProgressStep] = useState('');
  const [checkedOptions, setCheckedOptions] = useState(
    ANALYSIS_OPTIONS.reduce((acc, o) => ({ ...acc, [o.value]: o.defaultChecked }), {})
  );

  function getFileDisplay(file) {
    const size = file.size < 1024 * 1024
      ? (file.size / 1024).toFixed(1) + ' KB'
      : (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    const ext = file.name.split('.').pop().toUpperCase();
    const icons = { PDF: '📄', DOCX: '📝', DOC: '📝', TXT: '📃' };
    return { size, ext, icon: icons[ext] || '📄' };
  }

  function handleFile(file) {
    setCurrentFile(file);
    showToast('File ready: ' + file.name);
  }

  function removeFile() {
    setCurrentFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast('File removed.');
  }

  async function startAnalysis() {
    if (!currentFile) return showToast('Please upload a file first.');
    if (!authToken) {
      showToast('Please log in to analyse documents.');
      setTimeout(() => navigate('/auth'), 1000);
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
      const selected = Object.entries(checkedOptions).filter(([, v]) => v).map(([k]) => k);
      const formData = new FormData();
      formData.append('document', currentFile);
      formData.append('options', JSON.stringify(selected));

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
        navigate('/summary');
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

        {/* Dropzone */}
        <div
          className={`ls-dropzone${isDragging ? ' drag' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={e => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            style={{ display: 'none' }}
            onChange={e => { const f = e.target.files[0]; if (f) handleFile(f); }}
          />
          <span className="ls-dropzone-icon">📂</span>
          <h3>Drag &amp; drop your legal document here</h3>
          <p>or <span className="ls-browse-link">browse to upload</span></p>
          <div className="ls-file-types">
            {['PDF', 'DOCX', 'DOC', 'TXT', 'Up to 25MB'].map(t => (
              <span className="ls-file-type-badge" key={t}>{t}</span>
            ))}
          </div>
        </div>

        {/* File preview */}
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

        {/* Options */}
        <div className="ls-analyze-options">
          <h3>Analysis options</h3>
          <div className="ls-options-grid">
            {ANALYSIS_OPTIONS.map(o => (
              <label className="ls-option-check" key={o.value}>
                <input
                  type="checkbox"
                  checked={!!checkedOptions[o.value]}
                  onChange={e => setCheckedOptions(prev => ({ ...prev, [o.value]: e.target.checked }))}
                />
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

      {/* Progress overlay */}
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
