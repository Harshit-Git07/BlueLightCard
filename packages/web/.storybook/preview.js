import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StorybookAmplitudeContextDecorator } from '../src/common/context/AmplitudeExperiment/mocks/StorybookAmplitudeContextDecorator';
import { StorybookAuthContextDecorator } from '../src/common/context/Auth/mocks/StorybookAuthContextDecorator';
import { StorybookUserContextDecorator } from '../src/common/context/User/mocks/StorybookUserContextDecorator';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import '../src/styles/globals.css';
import '../src/styles/swiper.css';
import StorybookGraphQLMock from '../src/graphql/mocks/StorybookGraphQLMock';
import mockRouterDecorator from './decorators/mockRouterDecorator';

const queryClient = new QueryClient();

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  fetchMock: {
    mocks: [StorybookGraphQLMock],
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

const withProviders = (Story) => (
  <QueryClientProvider client={queryClient}>
    <Story />
  </QueryClientProvider>
);

export const decorators = [
  mockRouterDecorator,
  StorybookAuthContextDecorator,
  StorybookAmplitudeContextDecorator,
  withProviders,
  StorybookUserContextDecorator,
];
