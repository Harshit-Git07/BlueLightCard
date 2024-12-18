import '@testing-library/jest-dom/extend-expect';
import { FC, PropsWithChildren } from 'react';
import { NextRouter } from 'next/router';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { render, screen } from '@testing-library/react';
import { JotaiTestProvider } from '@/utils/jotaiTestProvider';
import {
  PlatformAdapterProvider,
  useMockPlatformAdapter,
} from '../../../../shared-ui/src/adapters';
import Spinner from '@/modules/Spinner';
import AccountPage from '@/pages/account';

const mockRouter: Partial<NextRouter> = {
  push: jest.fn(),
};

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

describe('Account Page', () => {
  const mockPlatformAdapter = useMockPlatformAdapter();

  const WithSpinner: FC<PropsWithChildren> = ({ children }) => {
    return (
      <div>
        {children}
        <Spinner />
      </div>
    );
  };

  const whenPageIsRendered = async (platformAdapter = mockPlatformAdapter) => {
    return render(
      <PlatformAdapterProvider adapter={platformAdapter}>
        <RouterContext.Provider value={mockRouter as NextRouter}>
          <JotaiTestProvider initialValues={[]}>
            <WithSpinner>
              <AccountPage />
            </WithSpinner>
          </JotaiTestProvider>
        </RouterContext.Provider>
      </PlatformAdapterProvider>,
    );
  };

  test('displays navigation links', async () => {
    whenPageIsRendered();

    const links = await screen.findAllByRole('link');

    expect(links[0]).toHaveAttribute('href', '/personal-information');
    expect(links[1]).toHaveAttribute('href', '/privacy-settings');
    expect(links[2]).toHaveAttribute('href', '/preferences');
    expect(links[3]).toHaveAttribute('href', '/help');
  });
});
