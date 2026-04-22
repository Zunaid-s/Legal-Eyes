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
      setTimeout(() => { 
        setName(''); setEmail(''); setSubject(''); setMessage(''); 
        setSuccess(false);
      }, 3000);
    } catch {
      showToast('Cannot reach server. Is the backend running?');
    }
  }

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-12 py-10 min-h-[70vh]">
      
      {/* --- LEFT SIDE: Content --- */}
      <div className="flex-1 space-y-6 max-w-lg">
        <h1 className="font-serif text-5xl md:text-6xl font-light leading-tight">
          Let's <em className="italic text-primary">talk</em>
        </h1>
        <p className="text-lg opacity-70 leading-relaxed">
          Have a question about a document type or want to share feedback? We read every message and reply within one business day.
        </p>
        
        <div className="space-y-4 pt-4">
          {[
            ['✉️', 'Email', 'hello@legal-eyes.in'],
            ['📍', 'Office', 'Greater Noida, India'],
            ['🕐', 'Response time', 'Within 24 hours'],
          ].map(([icon, title, val]) => (
            <div className="flex items-center gap-4 p-4 bg-base-200 border border-base-300 rounded-2xl shadow-sm" key={title}>
              <div className="text-2xl">{icon}</div>
              <div>
                <h4 className="text-[10px] uppercase tracking-widest font-bold opacity-50">{title}</h4>
                <p className="text-sm font-medium">{val}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- RIGHT SIDE: Form --- */}
      <div className="flex-1 w-full max-w-md">
        <div className="card bg-base-200 border border-base-300 shadow-xl p-8 space-y-6">
          <h2 className="font-serif text-2xl font-light">Send us a message</h2>
          
          <div className="space-y-4">
            <div className="form-control">
              <label className="label text-xs opacity-60 uppercase tracking-wide">Name</label>
              <input 
                type="text" 
                placeholder="Your name" 
                className="input input-bordered w-full focus:border-primary"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label text-xs opacity-60 uppercase tracking-wide">Email</label>
              <input 
                type="email" 
                placeholder="Your email" 
                className="input input-bordered w-full focus:border-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label text-xs opacity-60 uppercase tracking-wide">Message</label>
              <textarea 
                placeholder="How can we help?" 
                className="textarea textarea-bordered w-full min-h-[120px] focus:border-primary"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>

            {success && (
              <div className="alert alert-success py-2 shadow-sm">
                <span className="text-sm">Message sent successfully!</span>
              </div>
            )}

            <button 
              className="btn btn-primary w-full shadow-lg"
              onClick={handleContact}
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}