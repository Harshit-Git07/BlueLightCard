import { Config } from 'tailwindcss';
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

export default {
  darkMode: isStorybookLifecycle ? 'media' : 'class',
  presets,
  theme: {
    extend: {
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
  content: [
    './.storybook/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../shared-ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
} satisfies Config;
