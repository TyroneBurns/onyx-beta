import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        background: '#070B11',
        panel: '#0F1722',
        elevated: '#131D2B',
        foreground: '#F5F7FA',
        muted: '#9BA6B2'
      },
      boxShadow: {
        panel: '0 20px 80px rgba(0,0,0,0.35)',
        glow: '0 0 28px rgba(34,197,94,0.22)',
        danger: '0 0 28px rgba(244,63,94,0.20)',
        cyan: '0 0 28px rgba(34,211,238,0.18)'
      },
      backgroundImage: {
        'grid-fade': 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)'
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)']
      }
    }
  },
  plugins: []
};

export default config;
