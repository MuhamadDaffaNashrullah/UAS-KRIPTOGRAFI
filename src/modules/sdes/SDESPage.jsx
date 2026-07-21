import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { encrypt, decrypt, generateKeys } from './services/sdes.js';
import { bitArrayToPlain } from './utils/formatters.js';
import Navbar from '../../components/shared/Navbar';

/* ─── Constants ──────────────────────────────────────────────── */
const ACCENT  = '#0df5e3';   // blue S-DES (remapped to P3R teal)
const S0_TABLE = [[1,0,3,2],[3,2,1,0],[0,2,1,3],[3,1,3,2]];
const S1_TABLE = [[0,1,2,3],[2,0,1,3],[3,0,1,0],[2,1,0,3]];

/* ─── Utility ────────────────────────────────────────────────── */
function parseBits(str, len) {
  const clean = str.replace(/[^01]/g, '');
  if (clean.length !== len) return null;
  return clean.split('').map(Number);
}

/* ─── Sub-components ─────────────────────────────────────────── */

/** Bit cell */
function BitCell({ bit, highlight }) {
  const bg = highlight === 'teal' ? ACCENT : highlight === 'yellow' ? '#00a3ff' : highlight === 'pink' ? '#3b82f6' : '#111a2e';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: '28px', height: '28px', border: '2px solid #00d2ff',
      background: bg, fontFamily: '"Space Mono", monospace',
      fontSize: '12px', fontWeight: 700, color: highlight ? '#080d19' : '#ffffff', flexShrink: 0,
    }}>{bit}</span>
  );
}

/** Bit input row */
function BitInput({ label, bits, onChange, length, error }) {
  return (
    <div>
      <label style={{
        display: 'block', fontFamily: '"Space Grotesk", sans-serif',
        fontWeight: 900, fontSize: '11px', textTransform: 'uppercase',
        letterSpacing: '0.1em', color: '#ffffff', marginBottom: '8px',
      }}>{label}</label>
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
        {Array.from({ length }).map((_, i) => (
          <BitCell key={i} bit={bits[i] ?? 0} highlight={bits[i] === 1 ? 'teal' : ''} />
        ))}
      </div>
      <input
        type="text"
        maxLength={length}
        value={bits.join('')}
        onChange={e => onChange(e.target.value)}
        placeholder={'0'.repeat(length)}
        style={{
          width: '100%', padding: '10px 12px',
          fontFamily: '"Space Mono", monospace', fontSize: '14px',
          border: `4px solid ${error ? '#FF5757' : '#00d2ff'}`,
          boxShadow: error ? 'none' : '2px 2px 0px #00a3ff',
          background: '#17223b', outline: 'none', letterSpacing: '0.2em',
          color: '#ffffff'
        }}
      />
      {error && (
        <p style={{ color: '#FF5757', fontFamily: '"Space Mono",monospace', fontSize: '11px', marginTop: '4px' }}>
          ⚠ Harus tepat {length} digit biner (0 atau 1)
        </p>
      )}
    </div>
  );
}

/** Single step trace card */
function StepCard({ step, index, accentColor }) {
  const [open, setOpen] = useState(true);
  const inArr  = Array.isArray(step.input) ? step.input : (step.input?.left ? [...step.input.left, ...(step.input.right ?? []), ...(step.input.ep ?? [])] : null);
  const outArr = Array.isArray(step.output) ? step.output : (step.output?.left ? [...step.output.left, ...(step.output.right ?? [])] : null);

  return (
    <div style={{ border: '4px solid #00d2ff', boxShadow: '4px 4px 0px #00a3ff', background: '#111a2e', marginBottom: '12px' }}>
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '12px', padding: '12px 16px', border: 'none', background: '#111a2e', cursor: 'pointer',
          borderBottom: open ? '4px solid #00d2ff' : 'none',
          color: '#ffffff'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '28px', height: '28px', border: '3px solid #00d2ff',
            background: accentColor, fontFamily: '"Space Mono",monospace', fontSize: '12px', fontWeight: 700,
            color: '#080d19',
            flexShrink: 0,
          }}>{index + 1}</span>
          <span style={{ fontFamily: '"Space Grotesk",sans-serif', fontWeight: 900, fontSize: '13px', textTransform: 'uppercase', textAlign: 'left' }}>
            {step.label}
          </span>
        </div>
        <span style={{ fontSize: '16px', flexShrink: 0, color: '#00d2ff' }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={{ padding: '16px' }}>
          {/* Description */}
          <p style={{
            fontFamily: '"Space Grotesk",sans-serif', fontSize: '13px', lineHeight: 1.7,
            color: '#ffffff', marginBottom: '14px',
            padding: '10px 12px', background: '#17223b', border: '2px solid #00d2ff',
          }}>
            {step.description}
          </p>

          {/* Input / Output visual */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {inArr && (
              <div>
                <span style={{ fontFamily: '"Space Mono",monospace', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '6px' }}>Input</span>
                <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                  {inArr.map((b, i) => <BitCell key={i} bit={b} highlight={b === 1 ? 'teal' : ''} />)}
                </div>
              </div>
            )}
            {outArr && (
              <div>
                <span style={{ fontFamily: '"Space Mono",monospace', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '6px' }}>Output</span>
                <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                  {outArr.map((b, i) => <BitCell key={i} bit={b} highlight={b === 1 ? 'yellow' : ''} />)}
                </div>
              </div>
            )}
            {step.table && (
              <div>
                <span style={{ fontFamily: '"Space Mono",monospace', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '6px' }}>Tabel Permutasi</span>
                <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                  {step.table.map((v, i) => (
                    <span key={i} style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: '24px', height: '24px', border: '2px solid #00d2ff',
                      background: '#00a3ff', fontFamily: '"Space Mono",monospace', fontSize: '10px', fontWeight: 700,
                      color: '#080d19'
                    }}>{v}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/** SBox reference table */
function SBoxTable({ data, label, accent }) {
  return (
    <div style={{ border: '4px solid #00d2ff', boxShadow: '3px 3px 0px #00a3ff', background: '#111a2e', flex: 1, minWidth: '200px' }}>
      <div style={{ padding: '8px 12px', borderBottom: '3px solid #00d2ff', background: accent }}>
        <span style={{ fontFamily: '"Space Grotesk",sans-serif', fontWeight: 900, fontSize: '12px', textTransform: 'uppercase', color: '#ffffff' }}>{label}</span>
      </div>
      <div style={{ padding: '12px', overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontFamily: '"Space Mono",monospace', fontSize: '12px' }}>
          <thead>
            <tr>
              {['', 'col00', 'col01', 'col10', 'col11'].map(h => (
                <th key={h} style={{ padding: '4px 8px', textAlign: 'center', fontWeight: 700, color: '#cbd5e1', fontSize: '10px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, ri) => (
              <tr key={ri}>
                <td style={{ padding: '4px 8px', fontWeight: 700, color: '#cbd5e1', fontSize: '10px' }}>row{ri.toString(2).padStart(2,'0')}</td>
                {row.map((v, ci) => (
                  <td key={ci} style={{ padding: '4px 8px', textAlign: 'center', border: '2px solid #00d2ff', background: '#17223b', color: '#ffffff', fontWeight: 700 }}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Typewriter Hero Section untuk S-DES ──────────────── */
function SDESHeroSection() {
  const [displayedText, setDisplayedText] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const phrases = [
    ['MINI', 'DES'],
    ['8-BIT', 'BLOCK'],
    ['EASY', 'KEYS'],
    ['SBOX', 'FLOW'],
    ['STEP', 'TRACE']
  ];

  useEffect(() => {
    if (isTransitioning) return;
    const currentPhrase = phrases[currentPhraseIndex];
    const fullText = currentPhrase.join('\n');
    
    const typingSpeed = 150;
    const deleteSpeed = 70;
    const pauseAfterTyping = 3000;
    const transitionDelay = 1500;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayedText.length < fullText.length) {
          setDisplayedText(fullText.slice(0, displayedText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseAfterTyping);
        }
      } else {
        if (displayedText.length > 0) {
          setDisplayedText(displayedText.slice(0, -1));
        } else {
          setIsTransitioning(true);
          setIsDeleting(false);
          setTimeout(() => {
            setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
            setDisplayedText('');
            setIsTransitioning(false);
          }, transitionDelay);
        }
      }
    }, isDeleting ? deleteSpeed : (displayedText.length === fullText.length ? 0 : typingSpeed));

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentPhraseIndex, isTransitioning]);

  return (
    <section className="relative w-full py-8 md:py-12 border-b-4 border-[#00d2ff] bg-[#111a2e] overflow-hidden px-6 md:px-12 select-none text-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-12">
        <div className="flex-1 max-w-2xl">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="nb-badge animate-pulse text-black" style={{ background: ACCENT, borderColor: ACCENT }}>S-DES</span>
            <span className="nb-badge bg-[#080d19] text-white border-[#00d2ff] shadow-none">Tugas UAS • Sem 6</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.h2
              key={currentPhraseIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="font-display font-black text-5xl sm:text-7xl lg:text-8xl leading-[0.9] tracking-tighter uppercase text-white whitespace-pre-line min-h-[2.1em]"
            >
              {displayedText}
              {!isTransitioning && (
                <span className="inline-block w-1 h-[0.9em] bg-white ml-1 animate-pulse align-middle"></span>
              )}
            </motion.h2>
          </AnimatePresence>
          <p className="font-display font-extrabold text-xs sm:text-sm text-white/70 mt-3 max-w-xl uppercase">
            Simulator Interaktif S-DES — Visualisasi Pembangkitan Subkunci (K1 & K2), Permutasi Awal (IP), Putaran Feistel, Substitusi S-Box S0/S1, dan Permutasi Akhir (IP⁻¹).
          </p>
        </div>


        {/* Badges */}
        <div className="flex flex-wrap gap-4 items-center md:flex-col md:items-end flex-shrink-0">
          {[
            ['2 ROUNDS', ACCENT],
            ['8-BIT BLOCK', '#FFFFFF'],
            ['10-BIT KEY', '#00a3ff']
          ].map(([txt, bg], i) => (
            <motion.div
              key={txt}
              initial={{ scale: 0, rotate: i % 2 === 0 ? -15 : 15 }}
              animate={{ scale: 1, rotate: i % 2 === 0 ? -2 : 3 }}
              whileHover={{ scale: 1.1, rotate: 0, y: -4 }}
              transition={{ type: 'spring', stiffness: 220, damping: 10, delay: i * 0.05 }}
              className="text-[#080d19] border-[3px] border-[#00d2ff] px-4 py-2 font-display font-black text-xs sm:text-sm uppercase shadow-sm select-none cursor-pointer"
              style={{ background: bg, borderRadius: '0px', boxShadow: '3px 3px 0px #00a3ff' }}
            >
              {txt}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function SDESPage() {
  const [mode, setMode]           = useState('encrypt'); // 'encrypt' | 'decrypt'
  const [plainStr, setPlainStr]   = useState('00000000');
  const [keyStr, setKeyStr]       = useState('0000000000');
  const [result, setResult]       = useState(null);
  const [errors, setErrors]       = useState({});
  const [showSteps, setShowSteps] = useState(false);

  const plainBits = parseBits(plainStr, 8)  ?? Array(8).fill(0);
  const keyBits   = parseBits(keyStr,  10) ?? Array(10).fill(0);

  const handleProcess = useCallback(() => {
    const pb = parseBits(plainStr, 8);
    const kb = parseBits(keyStr, 10);
    const newErrors = {};
    if (!pb) newErrors.plain = true;
    if (!kb) newErrors.key   = true;
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }
    setErrors({});

    const keyData = generateKeys(kb);
    let encData;
    if (mode === 'encrypt') {
      encData = encrypt(pb, kb);
    } else {
      encData = decrypt(pb, kb);
    }

    setResult({
      input: pb,
      output: encData.result,
      keyTrace: keyData.trace,
      encTrace: encData.trace,
      K1: keyData.K1,
      K2: keyData.K2,
    });
    setShowSteps(false);
  }, [plainStr, keyStr, mode]);

  const handleReset = () => {
    setPlainStr('00000000');
    setKeyStr('0000000000');
    setResult(null);
    setErrors({});
    setShowSteps(false);
  };

  const inputLabel  = mode === 'encrypt' ? 'Plaintext (8-bit)' : 'Ciphertext (8-bit)';
  const outputLabel = mode === 'encrypt' ? 'Ciphertext (Hasil Enkripsi)' : 'Plaintext (Hasil Dekripsi)';

  return (
    <div style={{ minHeight: '100vh', background: '#080d19', color: '#ffffff', fontFamily: '"Space Grotesk", sans-serif' }}>
      <Navbar accentColor={ACCENT} moduleLabel="S-DES" />

      <SDESHeroSection />

      {/* ── Main Content ─────────────────────────── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0 }}>

            {/* ── Input Card ── */}
            <div style={{ border: '4px solid #00d2ff', boxShadow: '6px 6px 0px #00a3ff', background: '#111a2e' }}>
              <div style={{ padding: '12px 16px', borderBottom: '4px solid #00d2ff', background: '#111a2e', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontWeight: 900, fontSize: '14px', textTransform: 'uppercase', color: '#ffffff' }}>📥 Input Simulator</span>
              </div>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                {/* Mode Toggle */}
                <div>
                  <span style={{ display: 'block', fontWeight: 900, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', color: '#ffffff' }}>Mode Operasi</span>
                  <div style={{ display: 'inline-flex', border: '4px solid #00d2ff', overflow: 'hidden' }}>
                    {[['encrypt','🔒 Enkripsi'],['decrypt','🔓 Dekripsi']].map(([v, l]) => (
                      <button key={v} onClick={() => setMode(v)}
                        style={{
                          padding: '8px 20px', border: 'none', cursor: 'pointer',
                          fontFamily: '"Space Grotesk",sans-serif', fontWeight: 900, fontSize: '13px',
                          textTransform: 'uppercase', letterSpacing: '0.03em',
                          background: mode === v ? '#00d2ff' : '#111a2e',
                          color: mode === v ? '#080d19' : '#ffffff',
                          borderRight: v === 'encrypt' ? '4px solid #00d2ff' : 'none',
                          transition: 'background 0.1s, color 0.1s',
                        }}
                      >{l}</button>
                    ))}
                  </div>
                </div>

                {/* Bit inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <BitInput
                    label={inputLabel}
                    bits={parseBits(plainStr, 8) ?? Array(8).fill(0)}
                    length={8}
                    error={errors.plain}
                    onChange={v => { setPlainStr(v.replace(/[^01]/g,'')); setErrors(e => ({...e, plain: false})); }}
                  />
                  <BitInput
                    label="Kunci Enkripsi (10-bit)"
                    bits={parseBits(keyStr, 10) ?? Array(10).fill(0)}
                    length={10}
                    error={errors.key}
                    onChange={v => { setKeyStr(v.replace(/[^01]/g,'')); setErrors(e => ({...e, key: false})); }}
                  />
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button onClick={handleProcess} style={{
                    flex: 1, minWidth: '120px', padding: '12px 24px', border: '4px solid #00d2ff',
                    boxShadow: '4px 4px 0px #00a3ff', background: ACCENT, color: '#080d19',
                    fontFamily: '"Space Grotesk",sans-serif', fontWeight: 900, fontSize: '14px',
                    textTransform: 'uppercase', cursor: 'pointer', transition: 'transform 0.1s, box-shadow 0.1s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translate(2px,2px)'; e.currentTarget.style.boxShadow = '2px 2px 0px #00a3ff'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '4px 4px 0px #00a3ff'; }}
                  >▶ Proses S-DES</button>

                  <button onClick={handleReset} style={{
                    padding: '12px 20px', border: '4px solid #00d2ff', boxShadow: '4px 4px 0px #00a3ff',
                    background: '#111a2e', color: '#00d2ff',
                    fontFamily: '"Space Grotesk",sans-serif', fontWeight: 900, fontSize: '14px',
                    textTransform: 'uppercase', cursor: 'pointer', transition: 'transform 0.1s, box-shadow 0.1s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translate(2px,2px)'; e.currentTarget.style.boxShadow = '2px 2px 0px #00a3ff'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '4px 4px 0px #00a3ff'; }}
                  >↺ Reset</button>

                  <button onClick={() => { setPlainStr('01110010'); setKeyStr('1010000010'); setErrors({}); }} style={{
                    padding: '12px 20px', border: '4px solid #00d2ff', boxShadow: '4px 4px 0px #00a3ff',
                    background: '#3b82f6', color: '#ffffff',
                    fontFamily: '"Space Grotesk",sans-serif', fontWeight: 900, fontSize: '14px',
                    textTransform: 'uppercase', cursor: 'pointer', transition: 'transform 0.1s, box-shadow 0.1s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translate(2px,2px)'; e.currentTarget.style.boxShadow = '2px 2px 0px #00a3ff'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '4px 4px 0px #00a3ff'; }}
                  >⚗ Test Vector</button>
                </div>
              </div>
            </div>

            {/* ── Result Card ── */}
            <AnimatePresence>
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{ border: '4px solid #00d2ff', boxShadow: '6px 6px 0px #00a3ff', background: '#111a2e' }}
                >
                  <div style={{ padding: '12px 16px', borderBottom: '4px solid #00d2ff', background: '#111a2e', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 900, fontSize: '14px', textTransform: 'uppercase', color: ACCENT }}>
                      ✅ {outputLabel}
                    </span>
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    {/* Subkeys */}
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                      {[['K1', result.K1], ['K2', result.K2]].map(([label, bits]) => (
                        <div key={label} style={{ flex: 1, minWidth: '200px', border: '3px solid #00d2ff', boxShadow: '2px 2px 0px #00a3ff', background: '#111a2e' }}>
                          <div style={{ padding: '6px 12px', borderBottom: '3px solid #00d2ff', background: '#080d19' }}>
                            <span style={{ fontFamily: '"Space Mono",monospace', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', color: '#ffffff' }}>Subkunci {label}</span>
                          </div>
                          <div style={{ padding: '12px', display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                            {bits.map((b, i) => <BitCell key={i} bit={b} highlight={b === 1 ? 'teal' : ''} />)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Input → Output */}
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center justify-items-center md:justify-items-stretch mb-5">
                      <div style={{ border: '3px solid #00d2ff', boxShadow: '2px 2px 0px #00a3ff', background: '#111a2e' }}>
                        <div style={{ padding: '6px 12px', borderBottom: '3px solid #00d2ff', background: '#0d1624' }}>
                          <span style={{ fontFamily: '"Space Mono",monospace', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', color: '#ffffff' }}>{mode === 'encrypt' ? 'Plaintext' : 'Ciphertext'} Input</span>
                        </div>
                        <div style={{ padding: '12px', display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                          {result.input.map((b, i) => <BitCell key={i} bit={b} />)}
                        </div>
                        <div style={{ padding: '4px 12px', borderTop: '2px solid #00d2ff', color: '#ffffff' }}>
                          <code style={{ fontFamily: '"Space Mono",monospace', fontSize: '12px', fontWeight: 700 }}>
                            {result.input.join('')} = 0x{parseInt(result.input.join(''),2).toString(16).toUpperCase().padStart(2,'0')}
                          </code>
                        </div>
                      </div>

                      <div className="text-xl md:text-2xl font-black rotate-90 md:rotate-0 text-[#00d2ff]">→</div>

                      <div style={{ border: '4px solid #00d2ff', boxShadow: '4px 4px 0px #00a3ff', background: '#111a2e' }}>
                        <div style={{ padding: '6px 12px', borderBottom: '4px solid #00d2ff', background: '#080d19' }}>
                          <span style={{ fontFamily: '"Space Mono",monospace', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', color: '#ffffff' }}>{mode === 'encrypt' ? 'Ciphertext' : 'Plaintext'} Output</span>
                        </div>
                        <div style={{ padding: '12px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {result.output.map((b, i) => <BitCell key={i} bit={b} highlight={b === 1 ? 'teal' : 'yellow'} />)}
                        </div>
                        <div style={{ padding: '8px 12px', borderTop: '3px solid #00d2ff', background: '#17223b', color: '#0df5e3' }}>
                          <code style={{ fontFamily: '"Space Mono",monospace', fontSize: '14px', fontWeight: 900 }}>
                            {result.output.join('')} = 0x{parseInt(result.output.join(''),2).toString(16).toUpperCase().padStart(2,'0')}
                          </code>
                        </div>
                      </div>
                    </div>

                    {/* Show steps toggle */}
                    <button
                      onClick={() => setShowSteps(s => !s)}
                      style={{
                        width: '100%', padding: '12px 16px', border: '4px solid #00d2ff',
                        boxShadow: showSteps ? 'none' : '4px 4px 0px #00a3ff',
                        transform: showSteps ? 'translate(2px,2px)' : 'none',
                        background: showSteps ? '#00a3ff' : '#111a2e', color: showSteps ? '#080d19' : '#ffffff',
                        fontFamily: '"Space Grotesk",sans-serif', fontWeight: 900, fontSize: '13px',
                        textTransform: 'uppercase', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'space-between',
                      }}
                    >
                      <span>📋 {showSteps ? 'Sembunyikan' : 'Tampilkan'} Solusi Penyelesaian Step-by-Step</span>
                      <span>{showSteps ? '▲' : '▼'}</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ border: '4px solid #00d2ff', boxShadow: '4px 4px 0px #00a3ff', background: '#111a2e', padding: '3rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
                  <h3 style={{ fontFamily: '"Space Grotesk",sans-serif', fontWeight: 900, fontSize: '1.25rem', textTransform: 'uppercase', marginBottom: '8px', color: '#ffffff' }}>Simulator Siap</h3>
                  <p style={{ fontFamily: '"Space Grotesk",sans-serif', color: '#cbd5e1', fontSize: '0.9rem' }}>
                    Masukkan plaintext 8-bit dan kunci 10-bit, lalu tekan <strong>Proses S-DES</strong> untuk memulai.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Step-by-step Trace ── */}
            <AnimatePresence>
              {showSteps && result && (
                <motion.div key="steps" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

                  {/* Key Generation */}
                  <div style={{ border: '4px solid #00d2ff', boxShadow: '4px 4px 0px #00a3ff', background: '#111a2e', marginBottom: '1.5rem' }}>
                    <div style={{ padding: '12px 16px', borderBottom: '4px solid #00d2ff', background: '#111a2e' }}>
                      <span style={{ fontWeight: 900, fontSize: '14px', textTransform: 'uppercase', color: '#ffffff' }}>🗝️ Fase 1: Pembangkitan Kunci (K1 & K2)</span>
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <p style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: '13px', color: '#ffffff', marginBottom: '1rem', padding: '10px', background: '#17223b', border: '2px solid #00d2ff' }}>
                        Kunci 10-bit diolah menggunakan permutasi P10, pergeseran kiri (LS-1 & LS-2), dan permutasi P8 untuk menghasilkan dua subkunci K1 dan K2 yang masing-masing berukuran 8-bit.
                      </p>
                      {result.keyTrace.map((step, i) => (
                        <StepCard key={i} step={step} index={i} accentColor={ACCENT} />
                      ))}
                    </div>
                  </div>

                  {/* Encryption/Decryption */}
                  <div style={{ border: '4px solid #00d2ff', boxShadow: '4px 4px 0px #00a3ff', background: '#111a2e' }}>
                    <div style={{ padding: '12px 16px', borderBottom: '4px solid #00d2ff', background: '#111a2e' }}>
                      <span style={{ fontWeight: 900, fontSize: '14px', textTransform: 'uppercase', color: '#0df5e3' }}>
                        {mode === 'encrypt' ? '🔒 Fase 2: Proses Enkripsi' : '🔓 Fase 2: Proses Dekripsi'}
                      </span>
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <p style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: '13px', color: '#ffffff', marginBottom: '1rem', padding: '10px', background: '#17223b', border: '2px solid #00d2ff' }}>
                        {mode === 'encrypt'
                          ? 'Plaintext 8-bit diproses melalui IP → Putaran Feistel 1 (K1) → SW (Swap) → Putaran Feistel 2 (K2) → IP⁻¹ → Ciphertext.'
                          : 'Ciphertext 8-bit diproses melalui IP → Putaran Feistel 1 (K2) → SW (Swap) → Putaran Feistel 2 (K1) → IP⁻¹ → Plaintext. (Urutan kunci dibalik dari enkripsi).'}
                      </p>
                      {result.encTrace.map((step, i) => (
                        <StepCard key={i} step={step} index={i} accentColor="#00a3ff" />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Sidebar ─── S-Box Reference */}
          <div className="w-full lg:w-[300px] flex flex-col gap-4 lg:sticky lg:top-[72px] shrink-0">
            <div style={{ border: '4px solid #00d2ff', boxShadow: '4px 4px 0px #00a3ff', background: '#111a2e' }}>
              <div style={{ padding: '12px 16px', borderBottom: '4px solid #00d2ff', background: '#111a2e' }}>
                <span style={{ fontWeight: 900, fontSize: '13px', textTransform: 'uppercase', color: '#ffffff' }}>📊 Referensi S-Box</span>
              </div>
              <div className="p-4 flex flex-col sm:flex-row lg:flex-col gap-4">
                <SBoxTable data={S0_TABLE} label="S-Box S0" accent="#17223b" />
                <SBoxTable data={S1_TABLE} label="S-Box S1" accent="#0d1624" />
              </div>
            </div>

            {/* Algorithm info card */}
            <div style={{ border: '4px solid #00d2ff', boxShadow: '4px 4px 0px #00a3ff', background: '#111a2e', color: '#ffffff' }}>
              <div style={{ padding: '12px 16px', borderBottom: '4px solid #00d2ff' }}>
                <span style={{ fontWeight: 900, fontSize: '12px', textTransform: 'uppercase', color: '#ffffff' }}>ℹ️ Cara Kerja S-DES</span>
              </div>
              <div style={{ padding: '1rem' }}>
                {[
                  ['1', 'Key Gen', 'P10 → LS-1 → P8 → K1; LS-2 → P8 → K2'],
                  ['2', 'IP', 'Permutasi awal plaintext 8-bit'],
                  ['3', 'Round 1', 'Feistel dengan K1 (EP, XOR, S-Box, P4)'],
                  ['4', 'SW', 'Tukar bagian kiri dan kanan (Swap)'],
                  ['5', 'Round 2', 'Feistel dengan K2 (EP, XOR, S-Box, P4)'],
                  ['6', 'IP⁻¹', 'Permutasi invers → Ciphertext'],
                ].map(([n, step, desc]) => (
                  <div key={n} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'flex-start' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: '22px', height: '22px', border: '2px solid #00d2ff', background: '#00a3ff',
                      fontFamily: '"Space Mono",monospace', fontSize: '11px', fontWeight: 700, flexShrink: 0,
                      color: '#080d19'
                    }}>{n}</span>
                    <div>
                      <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontWeight: 900, fontSize: '12px', textTransform: 'uppercase', color: '#ffffff' }}>{step}</div>
                      <div style={{ fontFamily: '"Space Mono",monospace', fontSize: '10px', color: '#cbd5e1', lineHeight: 1.4 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────── */}
      <footer style={{
        marginTop: '3rem', borderTop: '4px solid #00d2ff', padding: '1.25rem 1.5rem',
        background: '#111a2e', textAlign: 'center',
        fontFamily: '"Space Mono", monospace', fontSize: '11px', fontWeight: 700,
        textTransform: 'uppercase', color: '#00d2ff',
      }}>
        S-DES Simulator · Teknik Informatika UNIBBA · Kriptografi 2026
      </footer>
    </div>
  );
}
