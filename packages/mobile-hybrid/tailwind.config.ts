import { Config } from 'tailwindcss';
import { join } from 'path';
import { createBrandedPreset } from '@bluelightcard/shared-ui/tailwind';
import { defaultPreset } from './src/defaultPreset';
import { env } from '@bluelightcard/shared-ui/env';

const newBrandedTokensPreset = createBrandedPreset(env.APP_BRAND);

/**
 * Kept both old and new since shared ui components e.g Offer Sheet are dependent on the legacy tokens
 * @TODO Remove 'defaultPreset' once all components in shared ui have been tokenised
 */
const presets: Partial<Config>[] = [defaultPreset, newBrandedTokensPreset];

const isStorybookLifecycle =
  process.env.npm_lifecycle_event === 'storybook' ||
  process.env.npm_lifecycle_event === 'build-storybook';

const config = {
  darkMode: isStorybookLifecycle ? 'media' : 'class',
  presets,
  theme: {
    extend: {
      screens: {
        sm: '330px',
        md: '560px',
        lg: '768px',
      },
    },
  },
  content: {
    relative: true,
    files: [
      join(__dirname, './.storybook/**/*.{js,ts,jsx,tsx,mdx}'),
      join(__dirname, './src/**/*.{js,ts,jsx,tsx,mdx}'),
      join(__dirname, '../shared-ui/src/**/*.{js,ts,jsx,tsx,mdx}'),
    ],
  },
} satisfies Config;

export default config;
