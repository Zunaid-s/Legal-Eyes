import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import BASE_URL from '../services/api';

export default function DocumentChat({ documentId, authToken, showToast }) {
  const [messages, setMessages] = useState([{ role: 'ai', text: "I'm ready. You can type or click the mic to speak!" }]);
  const [input, setInput] = useState('');
  const [interimInput, setInterimInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, interimInput]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          setInput(prev => prev + event.results[i][0].transcript);
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setInterimInput(interim);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
  }, []);

  const toggleListen = () => {
    if (!recognitionRef.current) {
      showToast("Speech recognition not supported.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setInterimInput('');
      recognitionRef.current.start();
    }
  };

  const sendMessage = async (overrideText) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim() || loading) return;

    const userMessage = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setInterimInput('');
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/api/v1/documents/${documentId}/query`, 
        { question: textToSend },
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
    <div className="drawer drawer-end z-50">
      <input 
        id="chat-drawer" 
        type="checkbox" 
        className="drawer-toggle" 
        checked={isOpen} 
        onChange={(e) => setIsOpen(e.target.checked)} 
      />
      
      {/* FAB Trigger Button */}
      <div className="drawer-content">
        <label 
          htmlFor="chat-drawer" 
          className="fixed bottom-6 right-6 btn btn-primary btn-md shadow-2xl rounded-none border-2 border-primary uppercase font-bold tracking-widest px-6 h-auto py-4 z-40"
        >
          Ask questions about this document
        </label>
      </div>

      {/* Sidebar Drawer */}
      <div className="drawer-side">
        <label htmlFor="chat-drawer" className="drawer-overlay"></label>
        <div className={`menu p-0 w-80 md:w-96 min-h-full bg-base-200 text-base-content flex flex-col shadow-2xl transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} absolute right-0`}>
          
          {/* Header */}
          <div className="p-4 border-b border-base-300 bg-base-300/50 flex justify-between items-center">
            <h3 className="font-serif font-bold italic flex items-center gap-2">
              <span className="text-primary text-xs">●</span> AI Assistant
            </h3>
            <button className="btn btn-ghost btn-sm btn-square" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`chat ${m.role === 'ai' ? 'chat-start' : 'chat-end'}`}>
                <div className={`chat-bubble rounded-none text-sm ${m.role === 'ai' ? 'chat-bubble-primary shadow-md' : 'chat-bubble-neutral bg-base-300'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {interimInput && (
              <div className="chat chat-end">
                <div className="chat-bubble rounded-none text-sm bg-base-300 opacity-70 italic">
                  {interimInput}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-base-100 border-t border-base-300">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center bg-base-200 p-1 border border-base-300 focus-within:border-primary">
                <button 
                  onClick={toggleListen}
                  className={`btn btn-square btn-ghost btn-sm rounded-none ${isListening ? 'text-error animate-pulse' : 'opacity-40 hover:opacity-100'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                </button>
                
                <input 
                  className="input input-ghost w-full focus:bg-transparent text-sm h-10 rounded-none px-2" 
                  placeholder={isListening ? "Listening..." : "Type a question..."} 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
              </div>
              <button 
                className="btn btn-primary btn-sm rounded-none w-full" 
                onClick={() => sendMessage()}
                disabled={loading}
              >
                {loading ? <span className="loading loading-spinner loading-xs"></span> : "Send Message"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}