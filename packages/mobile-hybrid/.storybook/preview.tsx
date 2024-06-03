import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { Preview } from '@storybook/react';
import fontDecorator from './fontDecorator';
import { env } from '@bluelightcard/shared-ui/env';

if (env.FLAG_NEW_TOKENS) {
  require('../src/styles/v2/globals.css');
  require('../src/styles/v2/carousel.css');
} else {
  require('../src/styles/globals.css');
  require('../src/styles/carousel.css');
}

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
