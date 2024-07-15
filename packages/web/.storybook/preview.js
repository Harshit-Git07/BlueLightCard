import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import '../src/styles/globals.css';
import '../src/styles/swiper.css';

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
