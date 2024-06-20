import '../src/styles/globals.css';
import '../src/styles/carousel.css';

import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { Preview } from '@storybook/react';
import fontDecorator from './fontDecorator';

const preview: Preview = {
  decorators: [fontDecorator],
  parameters: {
    viewport: {
      defaultViewport: 'iphonexr',
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
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
