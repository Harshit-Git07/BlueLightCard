import { Config } from 'tailwindcss';

const config: Partial<Config> = {
  theme: {
    extend: {
      screens: {
        mobile: '280px',
        'mobile-xl': '500px',
        tablet: '768px',
        laptop: '1024px',
        desktop: '1200px',
        landscapebf: {
          raw: '((min-device-width: 650px) and (max-height: 750px))',
        },
        landscapebfsm: {
          raw: '((min-device-width: 650px) and (max-height: 380px))',
        },
      },
      fontFamily: {
        museo: ['var(--font-museo)'],
        sourcesans: ['var(--font-sourcesans)'],
      },
      animation: {
        spin: 'spin 3s linear infinite',
        magicButtonGradient: 'magicButtonGradient 3s linear infinite',
      },
      keyframes: {
        magicButtonGradient: {
          '0%, 100%': { 'background-position': '0% 0%' },
          '50%': { 'background-position': '75% 0%' },
        },
      },
    },
  },
};

export default config;
