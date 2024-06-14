import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import '../src/styles/globals.css';

if (process.env.STORYBOOK_FLAG_NEW_TOKENS === 'true') {
  require('../src/styles/v2/globals.css');
  require('../src/styles/v2/swiper.css');
} else {
  require('../src/styles/globals.css');
  require('../src/styles/swiper.css');
}

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  viewport: {
    viewports: {
      ...INITIAL_VIEWPORTS,
      galaxyFold: {
        name: 'Galaxy Fold',
        styles: {
          width: '280px',
          height: '653px',
        },
      },
    },
  },
};
