import plugin from 'tailwindcss/plugin';
import type { Config } from 'tailwindcss';
const { fontFamily } = require('tailwindcss/defaultTheme');

const config: Config = {
  darkMode: ['class', '[data-theme^="dark-"]'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        ink: '#000',
        canvas: '#fff',
        'bg-dds': '#032341',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
      },
      maxHeight: {
        fold: 'calc(100svh - var(--header-height))',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    plugin(function ({ addVariant }) {
      addVariant('header-open', 'body:has(#header-open:checked) &');
      addVariant('header-closed', 'body:has(#header-open:not(:checked)) &');
      addVariant('blcUk', '.blcUk &');
      addVariant('blcAu', '.blcAu &');
      addVariant('dds', '.dds &');
    }),
  ],
  safelist: ['action', 'ghost'],
};

export default config;
