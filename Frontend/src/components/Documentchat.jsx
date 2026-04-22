import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import BASE_URL from '../services/api';

export default function DocumentChat({ documentId, authToken, showToast }) {
  const [messages, setMessages] = useState([{ role: 'ai', text: "I'm ready. You can type or click the mic to speak!" }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // Use a ref to store the recognition object to prevent re-renders from killing it
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Only listen for one phrase
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech Error:", event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        showToast("Microphone access denied. Please enable it in browser settings.");
      }
    };

    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
  }, [showToast]);

  const toggleListen = () => {
    if (!recognitionRef.current) {
      showToast("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        // Prevents crash if start is called while already active
        recognitionRef.current.stop();
      }
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/api/v1/documents/${documentId}/query`, 
        { question: input },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setMessages(prev => [...prev, { role: 'ai', text: res.data.answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Error connecting to AI." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-base-200 border border-base-300 shadow-xl h-[500px] flex flex-col overflow-hidden">
      <div className="p-4 border-b border-base-300 bg-base-300/50 flex justify-between items-center">
        <h3 className="font-serif font-bold italic flex items-center gap-2">
          <span className="text-primary text-xs">●</span> AI Assistant
        </h3>
        {isListening && (
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-error"></span>
            </span>
            <span className="text-[10px] font-bold text-error uppercase tracking-tighter">Listening</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`chat ${m.role === 'ai' ? 'chat-start' : 'chat-end'}`}>
            <div className={`chat-bubble text-sm ${m.role === 'ai' ? 'chat-bubble-primary shadow-md' : 'chat-bubble-ghost bg-base-300'}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-base-100 border-t border-base-300">
        <div className="flex gap-2 items-center bg-base-200 rounded-2xl p-1 pr-2 border border-transparent focus-within:border-primary transition-colors">
          <button 
            onClick={toggleListen}
            className={`btn btn-circle btn-ghost btn-sm ${isListening ? 'text-error' : 'opacity-40 hover:opacity-100'}`}
          >
            {isListening ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H10a1 1 0 01-1-1v-4z" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
            )}
          </button>
          
          <input 
            className="input input-ghost w-full focus:bg-transparent text-sm h-10" 
            placeholder={isListening ? "Listening... Speak clearly" : "Type a question..."} 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          
          <button className="btn btn-primary btn-sm rounded-xl h-8 min-h-0" onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}