import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row items-center justify-between min-h-[80vh] gap-12 py-10">
      {/* Left Content */}
      <div className="flex-1 space-y-6">
        <div className="badge badge-primary badge-outline py-3 px-4 uppercase tracking-widest text-xs font-bold">
          AI-Powered Clarity
        </div>
        <h1 className="font-serif text-5xl md:text-7xl leading-tight text-base-content font-light">
          Understand every <em className="italic text-primary">clause</em> before you sign.
        </h1>
        <p className="text-lg opacity-70 max-w-md leading-relaxed">
          Legal-eyes turns complex legalese into plain English, highlighting risks and obligations in seconds.
        </p>
        <div className="flex gap-4 pt-4">
          <button onClick={() => navigate('/auth')} className="btn btn-primary btn-lg px-8">Get Started</button>
          <button onClick={() => navigate('/about')} className="btn btn-ghost btn-lg">Learn More</button>
        </div>
      </div>

      {/* Right Content - Features Grid */}
      <div className="flex-1 grid grid-cols-1 gap-4 w-full max-w-md">
        <div className="card bg-base-200 border border-base-300 p-6 hover:translate-y-[-4px] transition-transform">
          <span className="text-2xl mb-2">🛡️</span>
          <h3 className="font-bold text-sm">Risk Detection</h3>
          <p className="text-xs opacity-60">Automatically flag aggressive non-competes and hidden fees.</p>
        </div>
        <div className="card bg-base-200 border border-base-300 p-6 hover:translate-y-[-4px] transition-transform">
          <span className="text-2xl mb-2">⚡</span>
          <h3 className="font-bold text-sm">Instant Analysis</h3>
          <p className="text-xs opacity-60">Upload a PDF and get a breakdown in under 10 seconds.</p>
        </div>
      </div>
    </div>
  );
}