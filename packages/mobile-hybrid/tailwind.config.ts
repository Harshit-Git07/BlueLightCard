import { Config } from 'tailwindcss';
import { createBrandedPreset } from '@bluelightcard/shared-ui/tailwind';
import { defaultPreset } from './src/defaultPreset';
import { env } from '@bluelightcard/shared-ui/env';

const newBrandedTokensPreset = createBrandedPreset(env.APP_BRAND);
const presets: Partial<Config>[] = [defaultPreset];

const isStorybookLifecycle = process.env.npm_lifecycle_event === 'storybook';

if (env.FLAG_NEW_TOKENS) {
  presets.push(newBrandedTokensPreset);
}

export default {
  darkMode: isStorybookLifecycle ? 'media' : 'class',
  presets,
  content: [
    './.storybook/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../shared-ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
} satisfies Config;
