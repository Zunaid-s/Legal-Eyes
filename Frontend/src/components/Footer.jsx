import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="ls-footer">
      <div className="ls-footer-grid">
        <div>
          <div className="ls-footer-logo">
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }}></span>
            Legal-eyes
          </div>
          <div className="ls-footer-col">
            <p>Demystifying legal language for everyone. Built with care for people who deserve to understand what they sign.</p>
          </div>
        </div>
        <div className="ls-footer-col">
          <h4>Product</h4>
          <a onClick={() => navigate('/upload')}>Upload Document</a>
          <a onClick={() => navigate('/summary')}>View Summary</a>

        </div>
        <div className="ls-footer-col">
          <h4>Company</h4>
          <a onClick={() => navigate('/about')}>About</a>
          <a onClick={() => navigate('/contact')}>Contact</a>
        </div>
        <div className="ls-footer-col">
        </div>
      </div>
      <div className="ls-footer-bottom">
        <p style={{ fontSize: 12, color: 'var(--ink-3)' }}>Built with ♥ for clarity</p>
      </div>
    </footer>
  );
}
