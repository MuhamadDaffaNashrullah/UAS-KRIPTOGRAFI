import './Footer.css';

/**
 * Footer - Bottom footer with branding and legal links
 */
export default function Footer({ className = '' }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`footer ${className}`}>
      <div className="footer__inner container">
        <p className="footer__copy">
          &copy; {currentYear} S-DES Simulator &bull; Cryptographic Processing Engine
        </p>
        <div className="footer__links">
          <span className="footer__text">Kriptografi Tugas 12</span>
        </div>
      </div>
    </footer>
  );
}
