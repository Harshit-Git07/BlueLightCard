/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{tsx,js}'],
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
    },
  },
  plugins: [],
};

export default config;
