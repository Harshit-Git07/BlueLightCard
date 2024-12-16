jest.mock('../../../../NavBarV2/hooks/useNavigationTracking', () => ({
  useNavigationTracking: jest.fn(),
}));

import { render, screen } from '@testing-library/react';
import { NavigationItem } from '../../../../NavBarV2/types';
import NavigationMobileDropdown from '../../../../NavBarV2/components/molecules/NavigationMobileDropdown';
import userEvent from '@testing-library/user-event';
import * as navigationHook from '../../../../NavBarV2/hooks/useNavigationTracking';

const clickDropdownOpen = async (container: HTMLElement) => {
  const dropdownTriggerButton = await container.querySelector('button');
  await userEvent.click(dropdownTriggerButton as HTMLButtonElement);
};

const clickSubItem = async (subItemLabel: string) => {
  const subItemButton = await screen.getByText(subItemLabel);
  await userEvent.click(subItemButton as HTMLButtonElement);
};

describe('NavigationMobileDropdown', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const mockTrackNavigationEvent = jest.fn();
  jest.spyOn(navigationHook, 'useNavigationTracking').mockImplementation(() => {
    return {
      trackNavigationEvent: mockTrackNavigationEvent,
    };
  });

  const subItemOneLabel = 'Mock Dropdown Sub Item One';
  const mockDropdownSubItemIDOne = 'mock-dropdown-sub-item-one';
  const mockDropdownSubItemIDTwo = 'mock-dropdown-sub-item-two';

  const subItemTwoLabel = 'Mock Dropdown Sub Item Two';
  const mockSubItemOneClick = jest.fn();
  const mockDropdownItem: NavigationItem = {
    id: 'mock-dropdown-item',
    label: 'Mock Top Label',
    children: [
      {
        id: mockDropdownSubItemIDOne,
        label: subItemOneLabel,
        onClick: mockSubItemOneClick,
        url: '/mock-sub-item-url',
      },
      {
        id: mockDropdownSubItemIDTwo,
        label: subItemTwoLabel,
        onClick: jest.fn(),
        url: '/mock-sub-item-url',
      },
    ],
  };
  it('renders', () => {
    const { container } = render(<NavigationMobileDropdown item={mockDropdownItem} />);
    expect(container).toMatchSnapshot();
  });

  it('should by default not show the dropdown', () => {
    const { container } = render(<NavigationMobileDropdown item={mockDropdownItem} />);
    expect(container.querySelector('ul')).toBeNull();
  });

  it('should show the dropdown when the top button is clicked', async () => {
    const { container } = render(<NavigationMobileDropdown item={mockDropdownItem} />);
    await clickDropdownOpen(container);
    expect(container.querySelector('ul')).toBeDefined();
    expect(screen.getByText(subItemOneLabel)).toBeDefined();
    expect(screen.getByText(subItemTwoLabel)).toBeDefined();
  });

  it('should show the chevronDown when the dropdown is not shown', () => {
    const { container } = render(<NavigationMobileDropdown item={mockDropdownItem} />);
    const icon = container.querySelector('svg');
    expect(icon?.getAttribute('data-icon')).toStrictEqual('chevron-down');
  });

  it('should show the chevronUp when the dropdown is shown', async () => {
    const { container } = render(<NavigationMobileDropdown item={mockDropdownItem} />);
    await clickDropdownOpen(container);
    const icon = container.querySelector('svg');
    expect(icon?.getAttribute('data-icon')).toStrictEqual('chevron-up');
  });

  it('should call the onClick and trackNavigationEvent functions when the subitem is clicked, and the dropdown should then be closed', async () => {
    const { container } = render(<NavigationMobileDropdown item={mockDropdownItem} />);
    await clickDropdownOpen(container);
    expect(container.querySelector('ul')).toBeDefined();
    await clickSubItem(subItemOneLabel);
    expect(mockSubItemOneClick).toHaveBeenCalled();
    expect(mockTrackNavigationEvent).toHaveBeenCalledWith(mockDropdownSubItemIDOne);
    expect(container.querySelector('ul')).toBeNull();
  });
});
