import { render } from '@testing-library/react';
import UnauthenticatedNavBar from '../../../../NavBarV2/components/organisms/UnauthenticatedNavBar';
import { NavigationItem } from '../../../../NavBar/types';

describe('UnauthenticaedNavBar', () => {
  it('renders', () => {
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
    const { container } = render(<UnauthenticatedNavBar navigationItems={mockNavigationItems} />);
    expect(container).toMatchSnapshot();
  });
});
