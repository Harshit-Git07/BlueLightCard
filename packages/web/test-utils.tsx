import { render } from '@testing-library/react';
import { FlagsmithProvider } from 'flagsmith/react';
import { ReactElement } from 'react';
import flagsmith from 'flagsmith';

const ProviderWrapper = ({ children }: { children: ReactElement }) => (
  <FlagsmithProvider
    options={{
      environmentID: '1234',
      cacheFlags: true,
    }}
    flagsmith={flagsmith}
  >
    {children}
  </FlagsmithProvider>
);

const customRender = (ui: ReactElement, options: any = {}) =>
  render(ui, { wrapper: ProviderWrapper, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
