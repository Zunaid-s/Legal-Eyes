import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ currentUser, onLogout }) {
  const location = useLocation();
  const path = location.pathname;
  const isAuthPage = path === '/auth';

  return (
    <div className="navbar bg-base-200 border-b border-base-300 px-4 md:px-8 sticky top-0 z-50">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl font-serif gap-2 text-primary">
          <span className="w-2 h-2 rounded-full bg-primary"></span>
          Legal-eyes
        </Link>
      </div>

      <div className="flex-none gap-2">
        <div className="hidden md:flex items-center gap-1">
          <Link to="/" className={`btn btn-ghost btn-sm ${path === '/' ? 'text-primary' : ''}`}>Home</Link>
          <Link to="/about" className={`btn btn-ghost btn-sm ${path === '/about' ? 'text-primary' : ''}`}>About</Link>

          {currentUser ? (
            <>
              <Link to="/upload" className={`btn btn-ghost btn-sm ${path === '/upload' ? 'text-primary' : ''}`}>Upload</Link>
              <Link to="/history" className={`btn btn-ghost btn-sm ${path === '/history' ? 'text-primary' : ''}`}>History</Link>
              <Link to="/contact" className={`btn btn-ghost btn-sm ${path === '/contact' ? 'text-primary' : ''}`}>Contact</Link>
              
              <div className="divider divider-horizontal mx-1"></div>
              
              <span className="text-xs opacity-70 px-2">
                {currentUser.name?.split(' ')[0]}
              </span>
              <button onClick={onLogout} className="btn btn-outline btn-error btn-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              {!isAuthPage && (
                <>
                  <Link to="/auth" className="btn btn-ghost btn-sm">Login</Link>
                  <Link to="/auth" className="btn btn-primary btn-sm ml-2">Get Started</Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}