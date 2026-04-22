import { useState } from 'react';
import axios from 'axios';

const Chat = ({ docId }) => {
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([]);

    const handleSendMessage = async () => {
        const res = await axios.post(`/api/v1/documents/${docId}/chat`, { message });
        setChatHistory([...chatHistory, { role: 'user', text: message }, { role: 'bot', text: res.data.reply }]);
        setMessage("");
    };

    return (
        <div className="p-4 bg-gray-100 rounded-lg">
            <div className="h-64 overflow-y-auto mb-4">
                {chatHistory.map((msg, i) => (
                    <div key={i} className={msg.role === 'user' ? "text-right" : "text-left"}>
                        <p className="inline-block p-2 m-1 bg-blue-500 text-white rounded">{msg.text}</p>
                    </div>
                ))}
            </div>
            <input 
                className="input input-bordered w-full" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                placeholder="Ask about the document..."
            />
            <button className="btn btn-primary mt-2" onClick={handleSendMessage}>Send</button>
        </div>
    );
};