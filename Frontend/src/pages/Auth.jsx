export default function Auth({ onLogin, showToast }) {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="card w-full max-w-md bg-base-200 shadow-2xl border border-base-300 overflow-hidden">
        <div className="p-10 space-y-8">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-light italic">Welcome to Legal-eyes</h2>
            <p className="text-xs opacity-60 mt-2 uppercase tracking-widest">Secure Document Analysis</p>
          </div>

          <div className="space-y-4">
            {/* Social Buttons use the Primary/Neutral colors from your OKLCH theme */}
            <button className="btn btn-outline w-full gap-4 normal-case font-medium border-base-300">
              <img src="/google-icon.svg" className="w-5 h-5" alt="Google" />
              Continue with Google
            </button>
            <button className="btn btn-neutral w-full gap-4 normal-case font-medium">
              <img src="/github-icon.svg" className="w-5 h-5 invert" alt="GitHub" />
              Continue with GitHub
            </button>
          </div>

          <div className="divider text-xs opacity-40 uppercase">Or continue with email</div>

          <div className="form-control w-full space-y-4">
            <input type="email" placeholder="Email Address" className="input input-bordered w-full focus:border-primary" />
            <button className="btn btn-primary w-full">Sign In</button>
          </div>
        </div>
      </div>
    </div>
  );
}