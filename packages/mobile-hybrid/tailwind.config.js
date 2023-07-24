/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    colors: {
      neutral: {
        white: '#FFFFFF',
        black: '#000000',
        grey: {
          100: '#BFBFBF',
          800: '#1C1D22'
        },
        oxfordblue: {
          100: '#FAFAFC',
          200: '#EDEDF2',
          400: '#CCCCD6',
          700: '#4D4D70',
          900: '#000033'
        }
      },
      primary: {
        dukeblue: {
          500: '#2929CC',
          700: '#000099',
          900: '#000580'
        },
        vividskyblue: {
          500: '#85E0FF',
          700: '#33CCFF'
        }
      },
      secondary: {
        lemon: {
          500: '#FFFFB3',
          700: '#FFFF00'
        },
        rose: {
          500: '#E55C8A',
          700: '#CC3366'
        },
        lilac: {
          500: '#BF7FBF',
          700: '#996699'
        }
      },
      semantic: {
        success: {
          300: '#D2F2C2',
          500: '#71DB3B',
          700: '#58C322'
        },
        danger: {
          300: '#F7D2D5',
          500: '#EE2E3D',
          700: '#D41121'
        },
        warning: {
          300: '#FFE8CC',
          500: '#FFB559',
          700: '#E99731'
        },
        info: {
          300: '#C2ECF2',
          500: '#18C0D9',
          700: '#01A1B9'
        }
      }
    }
  }
}
