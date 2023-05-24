import { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import { fontFamily } from 'tailwindcss/defaultTheme';
import { BRAND } from './global-vars';
import { buildTokens } from './scripts/dict';
import { addFontStyles } from './scripts/plugins';

// Check if we are running in storybook env or nextjs env
const staticFolderPrefix = !process.env.STORYBOOK_ENV ? '/_next/static' : '';

// only use the configured brand
const themeTokens = buildTokens([BRAND]);

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

// if we have size tokens, configure tailwindcss fontSize
if (themeTokens.size) {
  if (themeTokens.size.font) {
    (config.theme as any).fontSize = themeTokens.size.font;
  }
}

export default config;
