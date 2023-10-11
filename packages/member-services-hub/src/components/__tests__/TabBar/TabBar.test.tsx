import { render, screen, act, queryByAttribute } from '@testing-library/react';
import '@testing-library/jest-dom';
import TabBar from '../../TabBar/TabBar';
import { TabBarProps, TabItemProps } from '../../TabBar/types';

describe('TabBar component', () => {
  let props: TabBarProps;
  let items: TabItemProps[];
  beforeEach(() => {
    items = [
      {
        icon: <div data-testid="profile-icon" />,
        category: 'profile',
        title: 'Profile',
        details: 'Profile Details',
        open: 'profile',
      },
      {
        icon: <div data-testid="settings-icon" />,
        category: 'settings',
        title: 'Settings',
        details: 'Settings Details',
        open: 'settings',
      },
    ];
    props = {
      items: items,
      defaultOpen: 'profile',
      onTabClick: jest.fn(),
      selected: 'profile',
    };
  });
  it('should render TabBar component', () => {
    render(<TabBar {...props} />);
  });
  it('shoul render TabBar component with correct text', () => {
    render(<TabBar {...props} />);
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });
  it('should render TabBar component with correct icon', () => {
    render(<TabBar {...props} />);
    expect(screen.getByTestId('profile-icon')).toBeInTheDocument();
    expect(screen.getByTestId('settings-icon')).toBeInTheDocument();
  });
});
