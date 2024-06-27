import { Config } from 'tailwindcss';
import legacyTheme from './src/legacyTheme';
import { env } from './src/env';
import { createBrandedPreset } from './src/tailwind';

const newBrandedTokens = createBrandedPreset(env.APP_BRAND);
const presets = [legacyTheme, newBrandedTokens];

const isStorybookLifecycle =
  process.env.npm_lifecycle_event === 'storybook' ||
  process.env.npm_lifecycle_event === 'build-storybook';

const config: Config = {
  darkMode: isStorybookLifecycle ? 'media' : 'class',
  presets,
  content: ['./src/**/*.{tsx,js}', './docs/**/*.{tsx,mdx}'],
  plugins: [],
};

export default config;
