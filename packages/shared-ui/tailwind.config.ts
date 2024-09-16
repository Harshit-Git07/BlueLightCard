import { Config } from 'tailwindcss';
import legacyTheme from './src/legacyTheme';
import { env } from './src/env';
import { createBrandedPreset } from './src/tailwind';

const newBrandedTokens = createBrandedPreset(env.APP_BRAND);

const presets: Partial<Config>[] = [legacyTheme, newBrandedTokens];

const isStorybookLifecycle =
  process.env.npm_lifecycle_event === 'storybook' ||
  process.env.npm_lifecycle_event === 'build-storybook';

const config: Config = {
  darkMode: isStorybookLifecycle ? 'media' : 'class',
  presets,
  content: ['./src/**/*.{tsx,js}', './docs/**/*.{tsx,mdx}'],
  plugins: [],
  theme: {
    extend: {
      boxShadow: {
        offerSheetTop: '0 -2px 8px rgba(0, 0, 0, 0.1)',
        dropdownTop: '0 2px 8px rgba(0, 0, 0, 0.15)',
      },
    },
  },
};

export default config;
