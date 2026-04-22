import { useState } from 'react';

const API = 'https://legal-ai-livid-six.vercel.app';

export default function ContactPage({ showToast }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleContact() {
    if (!name || !email) return showToast('Please fill in your name and email.');
    try {
      const res = await fetch(`${API}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json();
      if (!res.ok) return showToast(data.error || 'Failed to send.');
      setSuccess(true);
      showToast('Message sent!');
      setTimeout(() => { setName(''); setEmail(''); setSubject(''); setMessage(''); }, 2000);
    } catch {
      showToast('Cannot reach server. Is the backend running?');
    }
  }

  return (
    <div className="ls-page">
      <div className="ls-contact-page">

        {/* Left */}
        <div className="ls-contact-left">
          <h1>Let's <em>talk</em></h1>
          <p>Have a question about a document type, a billing issue, or just want to share feedback? We read every message and reply within one business day.</p>
          <div className="ls-contact-info">
            {[
              ['✉️', 'Email', 'hello@legal-eyes.in'],
              ['📍', 'Office', 'greater noida'],
              ['🕐', 'Response time', 'in one day'],
            ].map(([icon, title, val]) => (
              <div className="ls-contact-item" key={title}>
                <div className="ls-contact-item-icon">{icon}</div>
                <div>
                  <h4>{title}</h4>
                  <p>{val}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
       
  
};
