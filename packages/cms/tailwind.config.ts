import { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import { fontFamily } from 'tailwindcss/defaultTheme';
import { buildTokens } from './scripts/dict';
import { addFontStyles } from './scripts/plugins';

const staticFolderPrefix = '/_next/static';

const themeTokens = buildTokens();

/** @type {import('tailwindcss').Config} */
const config: Config = {
  content: ['./src/**/*.{js,ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: themeTokens.color,
    },
    screens: {
      mobile: '280px',
      tablet: '768px',
      laptop: '1024px',
      desktop: '1200px',
    },
    fontFamily: Object.keys(themeTokens.font.family).reduce((acc, familyKey) => {
      acc[familyKey] = [
        themeTokens.font.family[familyKey],
        ...(fontFamily[familyKey as keyof typeof fontFamily] || []),
      ];
      return acc;
    }, {} as any),
  },
  plugins: [
    plugin(({ addBase }) =>
      addFontStyles({ font: themeTokens.asset.font, baseSrcUrl: staticFolderPrefix, addBase })
    ),
  ],
};

export default config;
