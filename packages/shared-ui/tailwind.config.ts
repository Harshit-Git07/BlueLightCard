import { Config } from 'tailwindcss';
import { join } from 'path';
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
  content: {
    relative: true,
    files: [join(__dirname, './src/**/*.{tsx,js}'), join(__dirname, './docs/**/*.{tsx,mdx}')],
  },
  plugins: [],
};

export default config;
