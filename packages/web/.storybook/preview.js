import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthedAmplitudeExperimentProvider } from '../src/common/context/AmplitudeExperiment';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import '../src/styles/globals.css';
import '../src/styles/swiper.css';
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
    <AuthedAmplitudeExperimentProvider>
      <Story />
    </AuthedAmplitudeExperimentProvider>
  </QueryClientProvider>
);

export const decorators = [mockRouterDecorator, withProviders];
