import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer p-10 bg-base-200 text-base-content border-t border-base-300">
      <nav>
        <h6 className="footer-title flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary"></span>
          Legal-eyes
        </h6> 
        <p className="max-w-xs opacity-70">
          Demystifying legal language for everyone. Built with care for people who deserve to understand what they sign.
        </p>
      </nav> 
      <nav>
        <h6 className="footer-title">Product</h6> 
        <a className="link link-hover" onClick={() => navigate('/upload')}>Upload Document</a>
        <a className="link link-hover" onClick={() => navigate('/summary')}>View Summary</a>
      </nav> 
      <nav>
        <h6 className="footer-title">Company</h6> 
        <a className="link link-hover" onClick={() => navigate('/about')}>About</a>
        <a className="link link-hover" onClick={() => navigate('/contact')}>Contact</a>
      </nav>
      <div className="w-full flex justify-between items-center pt-8 border-t border-base-300 col-span-full">
        <p className="text-xs opacity-50">Built with ♥ for clarity</p>
      </div>
    </footer>
  );
}