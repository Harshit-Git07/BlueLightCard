import { Config } from 'tailwindcss';
import { createBrandedPreset } from '@bluelightcard/shared-ui/tailwind';
import { defaultPreset } from './src/defaultPreset';
import { BRAND } from './env';
import { env } from '@bluelightcard/shared-ui/env';

const preset = createBrandedPreset(BRAND);

const newTokensActive = env.FLAG_NEW_TOKENS;

export default {
  presets: newTokensActive ? [preset] : [defaultPreset],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', '../shared-ui/src/**/*.{js,ts,jsx,tsx,mdx}'],
} satisfies Config;
