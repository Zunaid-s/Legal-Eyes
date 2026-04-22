import { useState } from 'react';
import axios from 'axios';
import BASE_URL from '../services/api';

const Chat = ({ docId, authToken }) => {
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSendMessage = async () => {
        if (!message.trim() || loading) return;

        const currentMessage = message;
        setMessage("");
        setChatHistory(prev => [...prev, { role: 'user', text: currentMessage }]);
        setLoading(true);

        try {
            const token = authToken || localStorage.getItem('legal-eyes_token');
            const res = await axios.post(`${BASE_URL}/api/v1/documents/${docId}/chat`,
                { message: currentMessage, history: chatHistory.slice(-5) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setChatHistory(prev => [...prev, { role: 'ai', text: res.data.reply }]);
        } catch (error) {
            console.error("Chat error:", error);
            setChatHistory(prev => [...prev, { role: 'ai', text: "Error connecting to AI." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 bg-gray-100 rounded-lg">
            <div className="h-64 overflow-y-auto mb-4">
                {chatHistory.map((msg, i) => (
                    <div key={i} className={msg.role === 'user' ? "text-right" : "text-left"}>
                        <p className={`inline-block p-2 m-1 rounded ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                            {msg.text}
                        </p>
                    </div>
                ))}
                {loading && <p className="text-left text-sm text-gray-500 italic p-2">Thinking...</p>}
            </div>
            <input
                className="input input-bordered w-full text-black"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about the document..."
            />
            <button className="btn btn-primary mt-2" onClick={handleSendMessage} disabled={loading}>
                {loading ? 'Sending...' : 'Send'}
            </button>
        </div>
    );
};

export default Chat;