import Navbar from './Navbar';
import Footer from './Footer';

export default function ModuleLayout({ children, accentColor, moduleLabel }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#080d19' }}>
      <Navbar accentColor={accentColor} moduleLabel={moduleLabel} />
      <main className="nb-container py-8 flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
