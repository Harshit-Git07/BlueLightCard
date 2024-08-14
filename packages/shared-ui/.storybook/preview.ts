import type { Preview } from '@storybook/react';
import '../src/styles/styles.css';
import mockRouterDecorator from './decorators/mockRouterDecorator';

export const decorators = [mockRouterDecorator];

const preview: Preview = {
  parameters: {
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
