import getCDNUrl from '@/utils/getCDNUrl';

export const CharacterEntities: Record<string, string> = {
  'Â£': '\u{00a3}',
  '\\.\\.\\.': '\u{2026}',
  "\\\\'": "'",
  'Ã𝇍â¬â𝇍': "'", //A Dixon Autos - About
  'â€™': "'",
  '€™': '\u{0000}', // Sonos - About
  â: "'", //Butlin's - Enjoy the best of Butlin's, plus an extra £20 off
};

export const recentSearchesData = [
  'nike',
  'jd sports',
  'new',
  'samsung',
  'new look',
  'british airways',
];

export const fallbackImage = getCDNUrl(`/misc/Logo_coming_soon.jpg`);

export const defaultPreset = {
  theme: {
    extend: {
      colors: {
        neutral: {
          white: '#FFFFFF',
          black: '#000000',
          grey: {
            100: '#ECEFF2',
            200: '#DCDCDC',
            400: '#9FA2A9',
            600: '#616266',
            800: '#1C1D22',
            900: '#202125',
          },
          oxfordblue: {
            100: '#FAFAFC',
            200: '#EDEDF2',
            400: '#CCCCD6',
            700: '#4D4D70',
            900: '#000033',
          },
        },
        primary: {
          dukeblue: {
            400: '#80ABFF',
            500: '#2929CC',
            600: '#001B80',
            700: '#000099',
            900: '#000580',
          },
          vividskyblue: {
            500: '#85E0FF',
            700: '#33CCFF',
          },
        },
        secondary: {
          lemon: {
            500: '#FFFFB3',
            700: '#FFFF00',
          },
          rose: {
            500: '#E55C8A',
            700: '#CC3366',
          },
          lilac: {
            500: '#BF7FBF',
            700: '#996699',
          },
        },
        semantic: {
          success: {
            300: '#D2F2C2',
            500: '#71DB3B',
            700: '#58C322',
          },
          danger: {
            300: '#F7D2D5',
            500: '#EE2E3D',
            700: '#D41121',
          },
          warning: {
            300: '#FFE8CC',
            500: '#FFB559',
            700: '#E99731',
          },
          info: {
            300: '#C2ECF2',
            500: '#18C0D9',
            700: '#01A1B9',
          },
        },
      },
      fontFamily: {
        museo: ['var(--font-museo)'],
        sourcesans: ['var(--font-sourcesans)'],
      },
      screens: {
        sm: '330px',
        md: '560px',
        lg: '768px',
      },
    },
  },
};
