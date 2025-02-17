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
        'tablet-xl': '800px',
        laptop: '1024px',
        desktop: '1200px',
      },
      animation: {},
      keyframes: {},
      boxShadow: {
        dropdownTop: '0 2px 8px rgba(0, 0, 0, 0.15)',
      },
    },
  },
} satisfies Config;
