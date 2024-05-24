import { Config } from 'tailwindcss';
import { createBrandedPreset } from '@bluelightcard/shared-ui/tailwind';
import { defaultPreset } from './src/constants';
import { BRAND } from './env';
import { env } from '@bluelightcard/shared-ui';

const preset = createBrandedPreset(BRAND);

const newTokensActive = env.FLAG_NEW_TOKENS;

export default {
  presets: newTokensActive ? [preset] : [defaultPreset],
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', '../shared-ui/src/**/*.{js,ts,jsx,tsx,mdx}'],
} satisfies Config;
