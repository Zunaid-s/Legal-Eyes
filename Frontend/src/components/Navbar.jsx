import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ currentUser, onLogout }) {
  const location = useLocation();
  const path = location.pathname;

  // Optional: Hide the full navigation menu on the auth page for a cleaner look
  const isAuthPage = path === '/auth';

  return (
    <nav className="ls-nav">
      <Link to="/" className="ls-nav-logo">
        <span className="dot"></span>Legal-eyes
      </Link>

      <div className="ls-nav-links">
        {/* Public Links: Always visible */}
        <Link to="/" className={path === '/' ? 'active' : ''}>Home</Link>
        <Link to="/about" className={path === '/about' ? 'active' : ''}>About</Link>

        {/* Conditional Rendering based on Auth Status */}
        {currentUser ? (
          <>
            {/* Protected Links: Only visible if logged in */}
            <Link to="/upload" className={path === '/upload' ? 'active' : ''}>Upload</Link>
            <Link to="/history" className={path === '/history' ? 'active' : ''}>History</Link>
            <Link to="/contact" className={path === '/contact' ? 'active' : ''}>Contact</Link>
            
            {/* User Profile & Logout */}
            <span style={{ 
              fontSize: 13, 
              color: 'var(--ink-3)', 
              padding: '6px 8px', 
              marginLeft: '10px',
              borderLeft: '1px solid var(--parchment-3)' 
            }}>
              {currentUser.name?.split(' ')[0]}
            </span>
            <button 
              onClick={onLogout} 
              className="ls-nav-logout-btn"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                color: 'var(--ink-2)',
                padding: '6px 14px'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {/* Guest Links: Only visible if logged out */}
            {!isAuthPage && (
              <>
                <Link to="/auth" className={path === '/auth' ? 'active' : ''}>Login</Link>
                <Link to="/auth" className="ls-nav-cta">Get Started</Link>
              </>
            )}
          </>
        )}
      </div>
    </nav>
  );
}