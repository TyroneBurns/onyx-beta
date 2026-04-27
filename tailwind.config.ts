import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        panel: 'hsl(var(--panel))',
        elevated: 'hsl(var(--elevated))',
        border: 'hsl(var(--border))',
        accent: 'hsl(var(--accent))',
        muted: 'hsl(var(--muted))',
        danger: 'hsl(var(--danger))',
        warning: 'hsl(var(--warning))',
        info: 'hsl(var(--info))',
        violet: 'hsl(var(--violet))'
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)']
      },
      boxShadow: {
        panel: '0 12px 40px rgba(0,0,0,0.34)',
        glow: '0 0 0 1px rgba(34,197,94,0.18), 0 0 36px rgba(34,197,94,0.15)',
        soft: '0 10px 24px rgba(0,0,0,0.24)'
      },
      backgroundImage: {
        'grid-fade': 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)'
      }
    }
  },
  plugins: []
};

export default config;
