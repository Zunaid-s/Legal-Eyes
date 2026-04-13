import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ currentUser, onLogout }) {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className="ls-nav">
      <Link to="/" className="ls-nav-logo">
        <span className="dot"></span>LexSimple
      </Link>
      <div className="ls-nav-links">
        <Link to="/" className={path === '/' ? 'active' : ''}>Home</Link>
        <Link to="/auth" className={path === '/auth' ? 'active' : ''}>
          {currentUser ? currentUser.name.split(' ')[0] : 'Login'}
        </Link>
        <Link to="/upload" className={path === '/upload' ? 'active' : ''}>Upload</Link>
        <Link to="/summary" className={path === '/summary' ? 'active' : ''}>Summary</Link>
        <Link to="/about" className={path === '/about' ? 'active' : ''}>About</Link>
        <Link to="/contact" className={path === '/contact' ? 'active' : ''}>Contact</Link>
        {currentUser
          ? <button onClick={onLogout}>Logout</button>
          : <Link to="/auth" className="ls-nav-cta">Get Started</Link>
        }
      </div>
    </nav>
  );
}
