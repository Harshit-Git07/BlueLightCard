import { render, screen } from '@testing-library/react';
import AuthenticatedNavBar from '../../../../NavBar/components/organisms/AuthenticatedNavBar';
import { NavigationItem } from '../../../../NavBar/types';
import userEvent from '@testing-library/user-event';

jest.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '',
    query: '',
    asPath: '',
  }),
}));

describe('AuthenticatedNavBar', () => {
  const mockNavigationItems: NavigationItem[] = [
    {
      id: 'nav-one',
      label: 'Mock Navigation Item',
      children: [{ id: 'nav-sub-item-one', label: 'Nav Sub Item' }],
    },
    {
      id: 'nav-two',
      label: 'Mock Navigation Item Two',
    },
  ];
  it('renders correctly without error', () => {
    const { container } = render(
      <AuthenticatedNavBar
        onSearchCategoryChange={jest.fn()}
        onSearchCompanyChange={jest.fn()}
        onSearchTerm={jest.fn()}
        navigationItems={mockNavigationItems}
      />
    );
    expect(container).toMatchSnapshot();
  });
  it('should not show the mobile menu by default', () => {
    render(
      <AuthenticatedNavBar
        onSearchCategoryChange={jest.fn()}
        onSearchCompanyChange={jest.fn()}
        onSearchTerm={jest.fn()}
        navigationItems={mockNavigationItems}
      />
    );
    expect(screen.queryByTestId('mobile-navigation')).toBeNull();
  });
  it('should show the mobile menu when the button is clicked', async () => {
    render(
      <AuthenticatedNavBar
        onSearchCategoryChange={jest.fn()}
        onSearchCompanyChange={jest.fn()}
        onSearchTerm={jest.fn()}
        navigationItems={mockNavigationItems}
      />
    );
    const mobileNavButton = screen.getByTestId('mobile-nav-toggle-button');
    await userEvent.click(mobileNavButton as HTMLButtonElement);
    expect(screen.queryByTestId('mobile-navigation')).toBeDefined();
  });
});
