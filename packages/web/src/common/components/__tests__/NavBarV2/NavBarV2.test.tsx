import { render, screen } from '@testing-library/react';
import NavBar from '../../Navigation/NavBarV2/NavBar';
import '@testing-library/jest-dom';
import { PlatformAdapterProvider, useMockPlatformAdapter } from '@bluelightcard/shared-ui/adapters';

jest.mock('../../Navigation/NavBar/helpers/getNavigationItems', () => {
  return {
    getNavigationItems: () => [{ id: 'mockNavItem', label: 'Mock Label' }],
  };
});

jest.mock('@/context/AmplitudeExperiment/hooks', () => ({
  ...jest.requireActual('@/context/AmplitudeExperiment/hooks.ts'), // This retains other exports
  useAmplitudeExperiment: jest.fn().mockResolvedValue({ data: { variantName: 'off' } }),
}));

jest.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '',
    query: '',
    asPath: '',
  }),
}));

describe('Navbar', () => {
  const mockPlatformAdapter = useMockPlatformAdapter();

  it('renders the authenticatedNavBar correctly when isAuthenticated is true', () => {
    const { container } = whenNavBarIsRenderedWithAuth(true);
    expect(container).toMatchSnapshot();
    expect(screen.getByTestId('authenticated-navbar')).toBeDefined();
  });

  it('renders the unauthenticated header when isAuthenticated if false', () => {
    const { container } = whenNavBarIsRenderedWithAuth(false);
    expect(container).toMatchSnapshot();
    expect(screen.getByTestId('unauthenticated-navbar')).toBeDefined();
  });

  const whenNavBarIsRenderedWithAuth = (isAuthenticated: boolean) => {
    return render(
      <PlatformAdapterProvider adapter={mockPlatformAdapter}>
        <NavBar
          isAuthenticated={isAuthenticated}
          onSearchCategoryChange={jest.fn()}
          onSearchCompanyChange={jest.fn()}
          onSearchTerm={jest.fn()}
        />
      </PlatformAdapterProvider>
    );
  };
});
