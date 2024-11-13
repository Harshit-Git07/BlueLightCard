---
to: <%= out %>/.storybook/preview.ts
---
import '../src/styles/globals.css';

import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { Preview } from '@storybook/react';

const preview: Preview = {
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
