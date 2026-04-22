import { useNavigate } from 'react-router-dom';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 md:px-8 space-y-20">
      
      {/* --- HERO SECTION --- */}
      <section className="flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <h1 className="font-serif text-4xl md:text-6xl font-light leading-tight">
            We believe <em className="italic text-primary">everyone</em> deserves to understand what they sign.
          </h1>
          <p className="text-lg opacity-70 leading-relaxed">
            Legal-eyes was built out of frustration — the kind you feel when a landlord shoves a 20-page lease at you and says "just sign here." Legal documents shouldn't require a law degree to understand. We're fixing that.
          </p>
          <p className="opacity-60 leading-relaxed">
            Founded in 2024, we've helped many people understand their contracts, leases, employment agreements, and more — before they signed them.
          </p>
          <button 
            className="btn btn-primary btn-lg px-10 shadow-lg mt-4" 
            onClick={() => navigate('/upload')}
          >
            Try It Now
          </button>
        </div>

        {/* Stats Grid using daisyUI Stats component */}
        <div className="flex-1 w-full bg-base-200 rounded-3xl p-8 border border-base-300">
          <div className="stats stats-vertical w-full bg-transparent gap-4">
            <div className="stat px-0">
              <div className="stat-value font-serif text-primary text-3xl">Across India</div>
              <div className="stat-desc opacity-70">Documents simplified for everyday people</div>
            </div>
            <div className="stat px-0 border-t border-base-300 pt-4">
              <div className="stat-value font-serif text-primary text-3xl">Free Forever</div>
              <div className="stat-desc opacity-70">Zero cost to analyze your personal documents</div>
            </div>
            <div className="stat px-0 border-t border-base-300 pt-4">
              <div className="stat-value font-serif text-primary text-3xl">12 Seconds</div>
              <div className="stat-desc opacity-70">Average time from upload to full summary</div>
            </div>
          </div>
        </div>
      </section>

      {/* --- VALUES SECTION --- */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          ['🔒', 'Privacy First', 'Your data is encrypted and deleted immediately after analysis. We process, summarize, and delete.'],
          ['⚖️', 'Not Legal Advice', "We're AI, not lawyers. We help you understand documents — for serious decisions, always consult a professional."],
          ['📖', 'Clarity Driven', 'Our mission is to translate complex "legalese" into plain English that anyone can understand.']
        ].map(([icon, title, desc]) => (
          <div key={title} className="card bg-base-200 border border-base-300 hover:border-primary transition-colors p-8 space-y-4">
            <div className="text-4xl">{icon}</div>
            <h3 className="font-serif text-2xl">{title}</h3>
            <p className="text-sm opacity-70 leading-relaxed">{desc}</p>
          </div>
        ))}
      </section>

      {/* --- TEAM SECTION --- */}
      <section className="text-center space-y-10 py-10">
        <div className="space-y-2">
          <h2 className="font-serif text-4xl font-light">The team behind Legal-eyes</h2>
          <p className="opacity-60">A small team of engineers, lawyers, and designers who care deeply about legal literacy.</p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { initial: 'G', name: 'Gyandeep Kumar', role: 'Founder & CEO', color: 'primary' },
            { initial: 'J', name: 'Juneth', role: 'Head of Legal AI', color: 'secondary' },
            { initial: 'N', name: 'Nitin Tiwari', role: 'Lead Engineer', color: 'accent' },
            { initial: 'S', name: 'Somesh Pandey', role: 'Product Designer', color: 'info' },
          ].map(m => (
            <div key={m.name} className="card bg-base-200 border border-base-300 p-6 flex flex-col items-center">
              <div className={`avatar placeholder mb-4`}>
                <div className={`bg-${m.color}/20 text-${m.color} rounded-full w-16 h-16 ring ring-${m.color} ring-offset-base-100 ring-offset-2`}>
                  <span className="text-xl font-serif">{m.initial}</span>
                </div>
              </div>
              <h4 className="font-medium text-sm">{m.name}</h4>
              <p className="text-xs opacity-50 uppercase tracking-widest mt-1">{m.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}