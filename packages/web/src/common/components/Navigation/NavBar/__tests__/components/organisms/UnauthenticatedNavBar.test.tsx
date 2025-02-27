import { render } from '@testing-library/react';
import UnauthenticatedNavBar from '../../../components/organisms/UnauthenticatedNavBar';
import { NavigationItem } from '../../../types';

describe('UnauthenticaedNavBar', () => {
  it('renders', () => {
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
    const { container } = render(<UnauthenticatedNavBar navigationItems={mockNavigationItems} />);
    expect(container).toMatchSnapshot();
  });
});
