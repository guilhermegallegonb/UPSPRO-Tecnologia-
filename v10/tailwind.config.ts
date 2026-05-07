import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'mr-bg':      'var(--c-bg)',
        'mr-bg2':     'var(--c-bg2)',
        'mr-surface': 'var(--c-surface)',
        'mr-border':  'var(--c-border)',
        'mr-primary': 'var(--c-primary)',
        'mr-accent':  'var(--c-accent)',
        'mr-text':    'var(--c-text)',
        'mr-text2':   'var(--c-text2)',
      },
      fontFamily: {
        serif:  ['var(--font-playfair)', 'Georgia', 'serif'],
        script: ['var(--font-dancing)', 'cursive'],
        sans:   ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in-up':   'fadeInUp 0.8s cubic-bezier(0.4,0,0.2,1) both',
        'fade-in':      'fadeIn 0.5s ease both',
        'heart-beat':   'heartBeat 2s ease-in-out infinite',
        'scroll-float': 'scrollFloat 3s ease-in-out infinite',
        'pulse-slow':   'pulse 3s ease-in-out infinite',
        'spin-slow':    'spin 8s linear infinite',
        'shimmer':      'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(24px)' },
          'to':   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to':   { opacity: '1' },
        },
        heartBeat: {
          '0%,100%': { transform: 'scale(1)' },
          '14%':     { transform: 'scale(1.3)' },
          '28%':     { transform: 'scale(1)' },
          '42%':     { transform: 'scale(1.2)' },
          '70%':     { transform: 'scale(1)' },
        },
        scrollFloat: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      backgroundImage: {
        'grad-btn':    'var(--grad-btn)',
        'grad-accent': 'var(--grad-accent)',
        'grad-hero':   'var(--grad-hero)',
      },
    },
  },
  plugins: [],
}

export default config
