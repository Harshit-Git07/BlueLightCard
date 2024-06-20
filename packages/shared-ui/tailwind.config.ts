import { Config } from 'tailwindcss';
import legacyTheme from './src/legacyTheme';
import { env } from './src/env';
import { createBrandedPreset } from './src/tailwind';

const presets = [legacyTheme];
const newBrandedTokens = createBrandedPreset(env.APP_BRAND);

if (env.FLAG_NEW_TOKENS) {
  presets.push(newBrandedTokens);
}

const config: Config = {
  presets,
  content: ['./src/**/*.{tsx,js}'],
  plugins: [],
};

export default config;
