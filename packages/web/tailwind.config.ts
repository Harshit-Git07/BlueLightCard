import { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import { BRAND } from './global-vars';
import { buildTokens } from './scripts/dict';
import { addFontStyles } from './scripts/plugins';
import { env } from '@bluelightcard/shared-ui/env';
import { createBrandedPreset } from '@bluelightcard/shared-ui/tailwind';
import { defaultPreset } from './src/defaultPreset';

// Check if we are running in storybook env or nextjs env
const staticFolderPrefix = !process.env.STORYBOOK_ENV ? '/_next/static' : '';

// only use the configured brand
const themeTokens = buildTokens([BRAND]);

const newBrandedTokensPreset = createBrandedPreset(env.APP_BRAND);
const presets: Partial<Config>[] = [defaultPreset, newBrandedTokensPreset];

const isStorybookLifecycle =
  process.env.npm_lifecycle_event === 'storybook' ||
  process.env.npm_lifecycle_event === 'build-storybook';

/** @type {import('tailwindcss').Config} */
const config: Config = {
  darkMode: isStorybookLifecycle ? 'media' : 'class',
  content: ['./src/**/*.{js,ts,tsx,mdx}', '../shared-ui/src/**/*.{js,ts,jsx,tsx,mdx}'],
  presets,
  plugins: [
    plugin(({ addBase }) =>
      addFontStyles({ font: themeTokens.asset.font, baseSrcUrl: staticFolderPrefix, addBase })
    ),
  ],
};

export default config;
