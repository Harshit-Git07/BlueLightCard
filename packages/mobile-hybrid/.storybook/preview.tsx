import '../src/styles/globals.css';
import '../src/styles/carousel.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { Preview, StoryFn } from '@storybook/react';
import fontDecorator from './fontDecorator';
import mockRouterDecorator from './mockRouterDecorator';

export const parameters: Preview['parameters'] = {
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
};

const withProviders = (Story: StoryFn) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <Story />
    </QueryClientProvider>
  );
};

export const decorators = [fontDecorator, mockRouterDecorator, withProviders];
