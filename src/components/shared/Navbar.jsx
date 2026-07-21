import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const modules = [
  { path: '/des',  label: 'DES',   color: '#3b82f6', bit: '64-bit' },
  { path: '/sdes', label: 'S-DES', color: '#0df5e3', bit: '8-bit'  },
  { path: '/aes',  label: 'AES',   color: '#00a3ff', bit: '128-bit'},
  { path: '/saes', label: 'S-AES', color: '#00d2ff', bit: '16-bit' },
];

export default function Navbar({ accentColor = '#00d2ff', moduleLabel = null }) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 border-b-4 border-nb-text"
      style={{ background: '#111a2e' }}
    >
      <div className="nb-container flex items-center justify-between h-16 relative">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-display font-black text-nb-text text-base sm:text-lg uppercase tracking-tight hover:opacity-80 transition-opacity shrink-0"
        >
          <span
            className="inline-flex items-center justify-center w-8 h-8 border-4 border-nb-text font-mono text-xs font-bold"
            style={{ background: '#00d2ff', color: '#080d19' }}
          >
            CF
          </span>
          <span>CryptoFlow</span>
          {moduleLabel && (
            <>
              <span className="text-nb-text/40 font-normal">/</span>
              <span className="text-nb-text">{moduleLabel}</span>
            </>
          )}
        </Link>

        {/* Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-10 h-10 border-4 border-[#00d2ff] bg-[#111a2e] text-[#00d2ff] shadow-[3px_3px_0px_#00a3ff] hover:bg-[#00d2ff] hover:text-[#080d19] transition-all relative z-50 focus:outline-none cursor-pointer"
          style={{ borderRadius: '0px' }}
        >
          <span className="material-symbols-outlined font-black text-xl select-none">
            {isOpen ? 'close' : 'menu'}
          </span>
        </button>

        {/* Dropdown Menu (Floating Neobrutalism) */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Overlay background to close dropdown */}
              <div 
                className="fixed inset-0 z-40 bg-black/40" 
                onClick={() => setIsOpen(false)} 
              />

              <motion.div
                initial={{ opacity: 0, y: -12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.95 }}
                transition={{ duration: 0.12, ease: 'easeOut' }}
                className="absolute right-4 top-[4.5rem] w-64 border-4 border-[#00d2ff] bg-[#111a2e] shadow-[6px_6px_0px_#00a3ff] flex flex-col p-3 z-50 gap-2"
                style={{ borderRadius: '0px' }}
              >
                <div className="font-mono text-[9px] font-black text-white/50 px-2 py-1 uppercase tracking-widest border-b-2 border-white/10 pb-2 mb-1">
                  Navigasi Simulator:
                </div>
                
                {modules.map((m) => {
                  const active = location.pathname === m.path;
                  return (
                    <Link
                      key={m.path}
                      to={m.path}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between px-3 py-2.5 font-display font-black text-xs sm:text-sm uppercase border-[3px] border-[#00d2ff] transition-all"
                      style={{
                        background: active ? '#00d2ff' : '#111a2e',
                        color: active ? '#080d19' : '#ffffff',
                        boxShadow: active ? 'none' : '2px 2px 0px #00a3ff',
                        transform: active ? 'translate(1.5px, 1.5px)' : 'none',
                        borderRadius: '0px'
                      }}
                    >
                      <span>{m.label}</span>
                      <span className="font-mono text-[9px] opacity-60">{m.bit}</span>
                    </Link>
                  );
                })}

                {!isHome && (
                  <Link
                    to="/"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 border-[3px] font-display font-black text-xs sm:text-sm uppercase transition-all mt-2"
                    style={{
                      borderColor: '#00d2ff',
                      background: '#111a2e',
                      color: '#00d2ff',
                      boxShadow: '2px 2px 0px #00a3ff',
                      borderRadius: '0px'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#00d2ff';
                      e.currentTarget.style.color = '#080d19';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = '#111a2e';
                      e.currentTarget.style.color = '#00d2ff';
                    }}
                  >
                    ← BERANDA UTAMA
                  </Link>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
