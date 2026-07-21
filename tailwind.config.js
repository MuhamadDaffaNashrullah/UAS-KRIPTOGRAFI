/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ========================
      // NEOBRUTALISM PASTEL (remapped for Persona 3 Reload dark theme)
      // ========================
      colors: {
        'nb-pink':   '#3b82f6', // Electric Blue
        'nb-teal':   '#0df5e3', // Vibrant Cyan/Teal
        'nb-yellow': '#00a3ff', // Deep Sky Blue
        'nb-blue':   '#00d2ff', // Vivid Cyan
        'nb-bg':     '#080d19', // P3R Deep Navy BG
        'nb-text':   '#ffffff', // White text
        'nb-white':  '#111a2e', // Dark Navy Panel BG
        'nb-error':  '#ff3b30', // Vivid Red

        // ========================
        // TUGAS 11 (DES) legacy colors — mapped to P3R
        // ========================
        brutal: {
          yellow:  '#00a3ff',   // remapped
          purple:  '#00d2ff',   // remapped
          orange:  '#3b82f6',   // remapped
          green:   '#0df5e3',   // remapped
          coral:   '#ff3b30',
          cream:   '#080d19',   // remapped to nb-bg
          surface: '#111a2e',   // remapped to P3R surface
          black:   '#00d2ff',   // remapped to cyan border
          white:   '#111a2e',   // remapped to dark container
        },

        // ========================
        // TUGAS 13 (AES) legacy CSS variable references
        // ========================
        surface:                      'var(--surface, #111a2e)',
        'surface-dim':                'var(--surface-dim, #0d1624)',
        'surface-bright':             'var(--surface-bright, #17223b)',
        'surface-container-lowest':   'var(--surface-container-lowest, #080d19)',
        'surface-container-low':      'var(--surface-container-low, #0c1424)',
        'surface-container':          'var(--surface-container, #111a2e)',
        'surface-container-high':     'var(--surface-container-high, #17223b)',
        'surface-container-highest':  'var(--surface-container-highest, #1e293b)',
        'on-surface':                 'var(--on-surface, #ffffff)',
        'on-surface-variant':         'var(--on-surface-variant, #cbd5e1)',
        'inverse-surface':            'var(--inverse-surface, #ffffff)',
        'inverse-on-surface':         'var(--inverse-on-surface, #080d19)',
        'outline':                    'var(--outline, #00d2ff)',
        'outline-variant':            'var(--outline-variant, #334155)',
        'surface-tint':               'var(--surface-tint, #00d2ff)',
        'primary':                    'var(--primary, #00d2ff)',
        'on-primary':                 'var(--on-primary, #080d19)',
        'primary-container':          'var(--primary-container, #004d7a)',
        'on-primary-container':       'var(--on-primary-container, #ffffff)',
        'inverse-primary':            'var(--inverse-primary, #00d2ff)',
        'secondary':                  'var(--secondary, #0df5e3)',
        'on-secondary':               'var(--on-secondary, #080d19)',
        'secondary-container':        'var(--secondary-container, #00665c)',
        'on-secondary-container':     'var(--on-secondary-container, #ffffff)',
        'tertiary':                   'var(--tertiary, #3b82f6)',
        'on-tertiary':                'var(--on-tertiary, #ffffff)',
        'tertiary-container':         'var(--tertiary-container, #1d4ed8)',
        'on-tertiary-container':      'var(--on-tertiary-container, #ffffff)',
        'error':                      'var(--error, #ff3b30)',
        'on-error':                   'var(--on-error, #ffffff)',
        'error-container':            'var(--error-container, #7f1d1d)',
        'on-error-container':         'var(--on-error-container, #ffffff)',
        'background':                 'var(--background, #080d19)',
        'on-background':              'var(--on-background, #ffffff)',
        'surface-variant':            'var(--surface-variant, #1e293b)',
        'accent-orange':              'var(--accent-orange, #00d2ff)',
        'accent-orange-light':        'var(--accent-orange-light, #004d7a)',
      },

      boxShadow: {
        // Neobrutalism P3R
        'nb':     '4px 4px 0px #00a3ff',
        'nb-sm':  '2px 2px 0px #00a3ff',
        'nb-lg':  '6px 6px 0px #00a3ff',
        'nb-xl':  '8px 8px 0px #00a3ff',
        'nb-pink':   '4px 4px 0px #3b82f6',
        'nb-teal':   '4px 4px 0px #0df5e3',
        'nb-yellow': '4px 4px 0px #00a3ff',
        'nb-blue':   '4px 4px 0px #00d2ff',
        // DES legacy
        'brutal-sm': '3px 3px 0 0 #00d2ff',
        'brutal':    '6px 6px 0 0 #00d2ff',
        'brutal-lg': '8px 8px 0 0 #00d2ff',
      },

      fontFamily: {
        // Neobrutalism new
        display: ['"Space Grotesk"', 'sans-serif'],
        body:    ['"Space Grotesk"', 'sans-serif'],
        // DES legacy aliases
        syne:    ['"Space Grotesk"', 'sans-serif'],
        grotesk: ['"Space Grotesk"', 'sans-serif'],
        inter:   ['"Space Grotesk"', 'sans-serif'],
        mono:    ['"Space Mono"', 'monospace'],
        // AES legacy aliases
        sans:    ['"Space Grotesk"', 'sans-serif'],
      },

      borderWidth: {
        '3': '3px',
        '4': '4px',
        '5': '5px',
      },

      borderRadius: {
        'nb': '2px',
      },

      keyframes: {
        'press': {
          '0%, 100%': { transform: 'translate(0,0)', boxShadow: '4px 4px 0px #111111' },
          '50%':      { transform: 'translate(2px,2px)', boxShadow: '2px 2px 0px #111111' },
        },
        'slide-in': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'press':    'press 0.15s ease-in-out',
        'slide-in': 'slide-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
