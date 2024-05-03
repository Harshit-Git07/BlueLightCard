/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{tsx,js}'],
  theme: {
    extend: {
      fontFamily: {
        museo: ['var(--font-museo)'],
        sourcesans: ['var(--font-sourcesans)'],
      },
    },
  },
  plugins: [],
};

export default config;
