import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {},
      screens: {
        mobile: '280px',
        'mobile-xl': '500px',
        tablet: '768px',
        laptop: '1024px',
        desktop: '1200px',
      },
    },
  },
} satisfies Config;
