import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import BASE_URL from '../services/api';

export default function DocumentChat({ documentId, authToken, showToast }) {
  const [messages, setMessages] = useState([{ role: 'ai', text: "I'm ready. You can type or click the mic to speak!" }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interimInput, setInterimInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Use a ref to store the recognition object to prevent re-renders from killing it
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, interimInput]);

  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    
    // Stop any existing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true; 
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      if (final) {
        setInput(prev => prev + final);
        setInterimInput('');
      } else {
        setInterimInput(interim);
      }
      
      // Auto-scroll to bottom of input if it's a textarea or just keep it visible
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

  const sendMessage = async (overrideInput) => {
    const textToSend = overrideInput || (input + interimInput);
    if (!textToSend.trim() || loading) return;
    
    // Stop listening if active when sending
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const userMessage = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setInterimInput('');
    setLoading(true);

    try {
      const token = authToken || localStorage.getItem('legal-eyes_token');
      const chatHistory = messages.slice(-5); // Send last 5 messages for context
      const res = await axios.post(`${BASE_URL}/api/v1/documents/${documentId}/chat`, 
        { message: textToSend, history: chatHistory },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(prev => [...prev, { role: 'ai', text: res.data.reply }]);
    } catch (err) {
      console.error("Chat API Error:", err);
      setMessages(prev => [...prev, { role: 'ai', text: "Error connecting to AI. Please check your connection." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="drawer drawer-end z-50">
      <input id="chat-drawer" type="checkbox" className="drawer-toggle" checked={isOpen} onChange={(e) => setIsOpen(e.target.checked)} />
      
      {/* Drawer Content (The FAB replacement) */}
      <div className="drawer-content fixed bottom-6 right-6 z-[60]">
        <label 
          htmlFor="chat-drawer" 
          className={`btn btn-primary shadow-2xl transition-all duration-300 drawer-button rounded-none border-2 border-primary min-h-12 h-auto py-2 w-48 flex items-center justify-center ${isOpen ? 'scale-0 pointer-events-none' : 'scale-100 hover:scale-105'}`}
          style={{ borderRadius: '0px' }}
        >
          <span className="text-sm px-2 text-center font-bold leading-tight uppercase tracking-wide">Ask questions about this document</span>
        </label>
      </div>

      {/* Drawer Side (The Chat Panel) */}
      <div className={`drawer-side fixed inset-0 ${isOpen ? 'visible' : 'pointer-events-none'}`}>
        <label htmlFor="chat-drawer" aria-label="close sidebar" className="drawer-overlay" onClick={() => setIsOpen(false)}></label>
        
        <div className={`min-h-full w-full sm:w-96 bg-base-200 text-base-content flex flex-col border-l border-base-300 absolute right-0 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} style={{ borderRadius: '0px' }}>
          <div className="p-4 border-b border-base-300 bg-base-300 flex justify-between items-center" style={{ borderRadius: '0px' }}>
            <h3 className="font-serif font-bold italic flex items-center gap-2">
              <span className="text-primary text-xs">●</span> AI Assistant
            </h3>
            <div className="flex items-center gap-3">
              {isListening && (
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-none bg-error opacity-75"></span>
                    <span className="relative inline-flex rounded-none h-2 w-2 bg-error"></span>
                  </span>
                  <span className="text-[10px] font-bold text-error uppercase tracking-tighter">Listening</span>
                </div>
              )}
              <button 
                type="button"
                className="btn btn-square btn-ghost btn-xs rounded-none" 
                onClick={() => setIsOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`chat ${m.role === 'ai' ? 'chat-start' : 'chat-end'}`}>
                <div className={`chat-bubble text-sm ${m.role === 'ai' ? 'chat-bubble-primary shadow-md' : ''}`}>
                  {m.text}
                  {m.role === 'ai' && (
                    <button 
                      onClick={() => speakText(m.text)}
                      className="ml-2 opacity-40 hover:opacity-100 transition-opacity"
                      title="Speak message"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat chat-start">
                <div className="chat-bubble chat-bubble-primary shadow-md text-sm italic opacity-70">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-base-100 border-t border-base-300" style={{ borderRadius: '0px' }}>
            <div className="flex gap-2 items-center bg-base-200 p-1 pr-2 border border-transparent focus-within:border-primary transition-colors" style={{ borderRadius: '0px' }}>
              <button 
                onClick={toggleListen}
                className={`btn btn-square btn-ghost btn-sm transition-all ${isListening ? 'text-error bg-error/10 animate-pulse' : 'opacity-60 hover:opacity-100 hover:bg-base-300'}`}
                style={{ borderRadius: '0px' }}
              >
                {isListening ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H10a1 1 0 01-1-1v-4z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                )}
              </button>
              
              <input 
                className="input input-ghost w-full focus:bg-transparent text-sm h-10" 
                style={{ borderRadius: '0px' }}
                placeholder={isListening ? "Listening... Speak clearly" : "Type a question..."} 
                value={input + interimInput}
                onChange={(e) => {
                  setInput(e.target.value);
                  setInterimInput('');
                }}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              
              <button className="btn btn-primary btn-sm h-8 min-h-0" style={{ borderRadius: '0px' }} onClick={sendMessage}>Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}