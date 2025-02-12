import { render, screen } from '@testing-library/react';
import AuthenticatedNavBar from '../../../components/organisms/AuthenticatedNavBar';
import { NavigationItem } from '../../../types';
import userEvent from '@testing-library/user-event';
import { PlatformAdapterProvider, useMockPlatformAdapter } from '@bluelightcard/shared-ui';
import { ExperimentClient } from '@amplitude/experiment-js-client';
import { as } from '@core/utils/testing';
import { AuthedAmplitudeExperimentProvider } from '@/context/AmplitudeExperiment';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '',
    query: '',
    asPath: '',
  }),
}));

describe('AuthenticatedNavBar', () => {
  const mockPlatformAdapter = useMockPlatformAdapter();
  const mockNavigationItems: NavigationItem[] = [
    {
      id: 'nav-one',
      label: 'Mock Navigation Item',
      links: [{ id: 'nav-sub-item-one', label: 'Nav Sub Item' }],
    },
    {
      id: 'nav-two',
      label: 'Mock Navigation Item Two',
      url: '/',
    },
  ];
  it('renders correctly without error', async () => {
    const { container } = await whenAuthenticatedNavBarIsRendered();
    expect(container).toMatchSnapshot();
  });
  it('should not show the mobile menu by default', async () => {
    await whenAuthenticatedNavBarIsRendered();
    expect(screen.queryByTestId('mobile-navigation')).toBeNull();
  });
  it('should show the mobile menu when the button is clicked', async () => {
    await whenAuthenticatedNavBarIsRendered();
    const mobileNavButton = screen.getByTestId('mobile-nav-toggle-button');
    await userEvent.click(mobileNavButton as HTMLButtonElement);
    expect(screen.queryByTestId('mobile-navigation')).toBeDefined();
  });

  const whenAuthenticatedNavBarIsRendered = async () => {
    const mockExperimentClient = {
      variant: jest.fn().mockReturnValue({ value: 'off' }),
    } satisfies Pick<ExperimentClient, 'variant'>;
    const experimentClientMock: () => Promise<ExperimentClient> = () =>
      Promise.resolve(as(mockExperimentClient));

    return render(
      <QueryClientProvider client={new QueryClient()}>
        <PlatformAdapterProvider adapter={mockPlatformAdapter}>
          <AuthedAmplitudeExperimentProvider initExperimentClient={experimentClientMock}>
            <AuthenticatedNavBar
              onSearchCategoryChange={jest.fn()}
              onSearchCompanyChange={jest.fn()}
              onSearchTerm={jest.fn()}
              navigationItems={mockNavigationItems}
            />
          </AuthedAmplitudeExperimentProvider>
        </PlatformAdapterProvider>
      </QueryClientProvider>
    );
  };
});
