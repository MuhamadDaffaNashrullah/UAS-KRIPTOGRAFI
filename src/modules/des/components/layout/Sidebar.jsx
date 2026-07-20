import React from 'react';
import { StepIndicator } from '../common/StepIndicator.jsx';
import { Shield } from 'lucide-react';

/**
 * Neubrutalist Simulator Sidebar Layout Component
 */
export function Sidebar({ activeSection = 'input', onSectionClick }) {
  return (
    <aside className="hidden lg:block w-72 border-r-4 border-black bg-brutal-white h-[calc(100vh-80px)] sticky top-[80px] p-6 overflow-y-auto select-none shrink-0">
      <div className="space-y-6">
        <StepIndicator
          activeSection={activeSection}
          onSectionClick={onSectionClick}
        />

        {/* Educational Info Box */}
        <div className="border-3 border-black p-4 bg-brutal-cream/50 space-y-2 text-xs">
          <div className="font-grotesk font-black flex items-center gap-1.5 uppercase text-black">
            <Shield className="w-4 h-4 stroke-[3px] text-brutal-yellow animate-pulse" />
            Parameter Utama DES
          </div>
          <p className="font-inter text-black/60 leading-relaxed">
            DES (Data Encryption Standard) adalah algoritma cipher blok kunci simetris yang memproses data dalam blok 64-bit menggunakan kunci 56-bit melalui 16 putaran struktur jaringan Feistel.
          </p>
        </div>

      </div>
    </aside>
  );
}

export default Sidebar;
