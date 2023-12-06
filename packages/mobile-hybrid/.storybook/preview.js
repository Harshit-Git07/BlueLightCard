import '../src/styles/globals.css';
/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile2',
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
