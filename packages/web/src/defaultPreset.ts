import { fontFamily } from 'tailwindcss/defaultTheme';
import { BRAND } from '../global-vars';
import { buildTokens } from '../scripts/dict';

const themeTokens = buildTokens([BRAND]);

const fonts = Object.keys(themeTokens.font.family).reduce((acc, familyKey) => {
  acc[familyKey] = [
    ...themeTokens.font.family[familyKey],
    ...(fontFamily[familyKey as keyof typeof fontFamily] || []),
  ];
  return acc;
}, {} as any);

export const defaultPreset = {
  theme: {
    extend: {
      colors: themeTokens.color,
      borderRadius: themeTokens.borderRadius,
      borderWidth: themeTokens.borderWidth,
      spacing: themeTokens.spacing,
      fontSize: themeTokens.font.size,
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
      boxShadow: {
        offerSheetTop: '0 -2px 8px rgba(0, 0, 0, 0.1)',
      },
    },
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
    fontFamily: fonts,
  },
};
