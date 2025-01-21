import plugin from 'tailwindcss/plugin';
import { env } from '@bluelightcard/shared-ui/env';
import { createBrandedPreset } from '@bluelightcard/shared-ui/tailwind';
import type { Config } from 'tailwindcss';

const brand = env.APP_BRAND;

const config: Config = {
  darkMode: ['class', 'no-dark'], // dark mode is not required for re-platforming
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    '../shared-ui/src/**/*.{js,ts,jsx,tsx,mdx}',
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
  presets: [createBrandedPreset(brand)],
};

export default config;
