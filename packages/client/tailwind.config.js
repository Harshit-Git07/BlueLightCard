/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,tsx,mdx}'],
  theme: {
    minWidth: {
      btn: '120px',
    },
    screens: {
      mobile: '280px',
      tablet: '768px',
      laptop: '1024',
      desktop: '1200px',
    },
    extend: {
      colors: {
        link: '#1366E2',
        primary: {
          'type-1': {
            base: '#000099',
            500: '#2929CC',
            900: '#000580',
          },
          'type-2': {
            base: '#33CCFF',
            500: '#85E0FF',
          },
        },
        neutrals: {
          'type-1': {
            base: '#000033',
            100: '#FAFAFC',
            200: '#EDEDF2',
            400: '#CCCCD6',
            700: '#4D4D70',
          },
        },
        semantic: {
          success: {
            base: '#58C322',
            300: '#D2F2C2',
            500: '#71DB3B',
          },
          danger: {
            base: '#D41121',
            300: '#F7D2D5',
            500: '#EE2E3D',
          },
        },
      },
    },
  },
  plugins: [],
};
