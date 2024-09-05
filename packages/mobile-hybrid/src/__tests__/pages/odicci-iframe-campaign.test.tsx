import '@testing-library/jest-dom/extend-expect';
import { FC, PropsWithChildren } from 'react';
import { NextRouter } from 'next/router';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { act, render, screen } from '@testing-library/react';
import { JotaiTestProvider } from '@/utils/jotaiTestProvider';
import {
  PlatformAdapterProvider,
  useMockPlatformAdapter,
} from '../../../../shared-ui/src/adapters';
import { userProfile } from '@/components/UserProfileProvider/store';
import Spinner from '@/modules/Spinner';
import OdicciIframeCampaignPage from '@/pages/odicci-iframe-campaign';

const mockRouter: Partial<NextRouter> = {
  push: jest.fn(),
  query: {
    iframeUrl: 'https://api.odicci.com/widgets/iframe_loaders/8d11f7da521240eda77f',
  },
};

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

describe('Odicci Iframe Campaign Page', () => {
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
    return act(() =>
      render(
        <PlatformAdapterProvider adapter={platformAdapter}>
          <RouterContext.Provider value={mockRouter as NextRouter}>
            <JotaiTestProvider
              initialValues={[
                [
                  userProfile,
                  { service: 'test-organisation', isAgeGated: true, uuid: 'mock-uuid-1' },
                ],
              ]}
            >
              <WithSpinner>
                <OdicciIframeCampaignPage />
              </WithSpinner>
            </JotaiTestProvider>
          </RouterContext.Provider>
        </PlatformAdapterProvider>,
      ),
    );
  };

  it('should load the Odicci iframe', async () => {
    const { container } = await whenPageIsRendered();

    const iframeElement = await screen.findByTestId('odicci-iframe');

    expect(iframeElement).toBeInTheDocument();
    expect(iframeElement).toHaveAttribute(
      'src',
      'https://api.odicci.com/widgets/iframe_loaders/8d11f7da521240eda77f?odicci_external_user_id=mock-uuid-1',
    );
  });
});
