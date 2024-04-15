import { render } from '@testing-library/react';
import { ReactElement } from 'react';
import { LoggedOutAmplitudeExperimentProvider } from './src/common/context/AmplitudeExperiment';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const ProviderWrapper = ({ children }: { children: ReactElement }) => (
  <QueryClientProvider client={queryClient}>
    <LoggedOutAmplitudeExperimentProvider>{children}</LoggedOutAmplitudeExperimentProvider>
  </QueryClientProvider>
);

const customRender = (ui: ReactElement, options: any = {}) =>
  render(ui, { wrapper: ProviderWrapper, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
