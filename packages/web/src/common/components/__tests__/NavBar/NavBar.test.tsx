import { render, screen } from '@testing-library/react';
import NavBar from '../../NavBar/NavBar';
import { NavigationItem } from '../../NavBar/types';
import { BRANDS } from '../../../types/brands.enum';

jest.mock('../../NavBar/helpers/getNavigationItems', () => {
  return {
    getNavigationItems: (brand: BRANDS, isAuthenticated: boolean) => [
      { id: 'mockNavItem', label: 'Mock Label' },
    ],
  };
});

jest.mock('../../../context/AmplitudeExperiment/hooks', () => ({
  ...jest.requireActual('../../../context/AmplitudeExperiment/hooks.ts'), // This retains other exports
  useAmplitudeExperiment: jest.fn().mockResolvedValue({ data: { variantName: 'off' } }),
}));

describe('Navbar', () => {
  it('renders the authenticatedNavBar correctly when isAuthenticated is true', () => {
    const { container } = render(
      <NavBar
        isAuthenticated
        onSearchCategoryChange={jest.fn()}
        onSearchCompanyChange={jest.fn()}
        onSearchTerm={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
    expect(screen.getByTestId('authenticated-navbar')).toBeDefined();
  });
  it('renders the unauthenticated header when isAuthenticated if false', () => {
    const { container } = render(
      <NavBar
        isAuthenticated={false}
        onSearchCategoryChange={jest.fn()}
        onSearchCompanyChange={jest.fn()}
        onSearchTerm={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
    expect(screen.getByTestId('unauthenticated-navbar')).toBeDefined();
  });
});
