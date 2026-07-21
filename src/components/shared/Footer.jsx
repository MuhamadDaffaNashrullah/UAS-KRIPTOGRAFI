import { Link } from 'react-router-dom';
import { Shield, Key, Cpu, Terminal, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#111a2e] border-t-4 border-nb-text mt-auto">
      {/* Top Banner */}
      <div className="border-b-4 border-nb-text bg-[#00a3ff]/10 py-4">
        <div className="nb-container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="animate-pulse flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0df5e3] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0df5e3]"></span>
            </span>
            <p className="font-mono text-xs text-white/80 font-bold uppercase tracking-wider">
              Status Sistem: Siap Simulasi • 4 Modul Aktif
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-white/60">
            <span>UAS Kriptografi Semester 6</span>
            <span className="w-1.5 h-1.5 bg-[#00d2ff] rounded-full"></span>
            <span>Nilai A+ Goal 🚀</span>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="nb-container py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left column: Brand */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 font-display font-black text-nb-text text-xl uppercase tracking-tight hover:opacity-80 transition-opacity self-start"
          >
            <span
              className="inline-flex items-center justify-center w-9 h-9 border-4 border-nb-text font-mono text-sm font-bold shadow-[2px_2px_0px_#00a3ff]"
              style={{ background: '#00d2ff', color: '#080d19' }}
            >
              CF
            </span>
            <span>CryptoFlow</span>
          </Link>
          <p className="font-body text-sm text-white/70 max-w-sm leading-relaxed">
            Unified platform untuk visualisasi dan simulasi algoritma kriptografi simetris klasik dan modern secara detail (bit-by-bit).
          </p>
          <div className="flex gap-2 mt-2">
            <span className="nb-badge bg-[#3b82f6] text-white">React 19</span>
            <span className="nb-badge bg-[#00d2ff] text-[#080d19]">Vite</span>
            <span className="nb-badge bg-[#0df5e3] text-[#080d19]">Tailwind</span>
          </div>
        </div>

        {/* Center column: Algorithms */}
        <div className="md:col-span-3 flex flex-col gap-4">
          <h4 className="font-display font-black text-sm uppercase text-white tracking-widest border-b-2 border-white/10 pb-2">
            Simulator
          </h4>
          <ul className="flex flex-col gap-2 font-mono text-xs">
            <li>
              <Link to="/des" className="flex items-center gap-2 text-white/70 hover:text-[#3b82f6] transition-colors group">
                <Shield className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                <span>Data Encryption Standard (DES)</span>
              </Link>
            </li>
            <li>
              <Link to="/sdes" className="flex items-center gap-2 text-white/70 hover:text-[#0df5e3] transition-colors group">
                <Key className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                <span>Simplified DES (S-DES)</span>
              </Link>
            </li>
            <li>
              <Link to="/aes" className="flex items-center gap-2 text-white/70 hover:text-[#00a3ff] transition-colors group">
                <Cpu className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                <span>Advanced Encryption Standard (AES)</span>
              </Link>
            </li>
            <li>
              <Link to="/saes" className="flex items-center gap-2 text-white/70 hover:text-[#00d2ff] transition-colors group">
                <Terminal className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                <span>Simplified AES (S-AES)</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Right column: Developer info */}
        <div className="md:col-span-4 flex flex-col gap-4">
          <div
            className="p-5 border-4 border-[#00d2ff] bg-[#17223b] shadow-[4px_4px_0px_#00a3ff]"
            style={{ borderRadius: '0px' }}
          >
            <h4 className="font-display font-black text-xs uppercase text-[#0df5e3] tracking-wider mb-2">
              KREDIT PENGEMBANG
            </h4>
            <p className="font-display font-black text-lg text-white mb-1 uppercase tracking-tight">
              Muhamad Daffa Nashrullah
            </p>
            <p className="font-mono text-[10px] text-white/60 mb-3">
              Mahasiswa Kriptografi • Semester 6
            </p>
            <div className="border-t border-white/10 pt-3 flex items-center justify-between font-mono text-[10px] text-white/50">
              <span>Proyek Tugas UAS</span>
              <span className="flex items-center gap-1 text-[#ff3b30]">
                Made with <Heart className="w-3 h-3 fill-current animate-bounce" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t-2 border-nb-text bg-[#080d19] py-4">
        <div className="nb-container flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-white/40 text-center">
          <p>&copy; {currentYear} CryptoFlow. Dikembangkan untuk keperluan edukasi dan perkuliahan.</p>
          <div className="flex gap-4 font-bold">
            <span className="text-[#00d2ff]">Vercel Deploy</span>
            <span className="text-white/30">•</span>
            <span className="text-[#0df5e3]">Custom my.id Domain</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
