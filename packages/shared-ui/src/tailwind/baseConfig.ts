import type { Config } from 'tailwindcss';
import { join } from 'path';

export default {
  content: {
    relative: true,
    files: [join(__dirname, './src/**/*.{js,ts,tsx,mdx}')],
  },
  theme: {
    extend: {
      fontFamily: {},
      fontSize: {},
      lineHeight: {},
      fontWeight: {},
      colors: {},
      letterSpacing: {},
      screens: {
        mobile: '280px',
        'mobile-xl': '500px',
        tablet: '768px',
        laptop: '1024px',
        desktop: '1200px',
      },
      animation: {},
      keyframes: {},
    },
  },
} satisfies Config;
