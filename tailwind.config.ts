import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#111111',
        brand: { DEFAULT: '#E32636', dark: '#B91C2B' },
        gold: '#F5C542',
        paper: '#F4F4F4',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(-3deg)' },
          '50%': { transform: 'translateY(-12px) rotate(-1deg)' },
        },
        'zoom-in': {
          '0%': { opacity: '0', transform: 'scale(.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        cover: {
          '0%': { opacity: '0', transform: 'scale(.82) rotate(-5deg) translateY(40px)', filter: 'blur(14px)' },
          '60%': { opacity: '1', filter: 'blur(0)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(0) translateY(0)', filter: 'blur(0)' },
        },
        shine: {
          '0%': { transform: 'translateX(-120%) skewX(-20deg)' },
          '100%': { transform: 'translateX(320%) skewX(-20deg)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        cover: 'cover 1.4s cubic-bezier(.2,.8,.2,1) both',
        'zoom-in': 'zoom-in .9s cubic-bezier(.2,.7,.2,1) both',
        shine: 'shine 3.2s ease-in-out infinite',
        marquee: 'marquee 32s linear infinite',
        'fade-up': 'fade-up .7s cubic-bezier(.2,.7,.2,1) both',
      },
    },
  },
  plugins: [],
};

export default config;
