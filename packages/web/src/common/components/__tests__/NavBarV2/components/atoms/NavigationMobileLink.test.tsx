jest.mock('../../../../Navigation/NavBarV2/hooks/useNavigationTracking', () => ({
  useNavigationTracking: jest.fn(),
}));

import * as navigationHook from '../../../../Navigation/NavBarV2/hooks/useNavigationTracking';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NavigationMobileLink from '../../../../Navigation/NavBarV2/components/atoms/NavigationMobileLink';
import { NavigationItem } from '../../../../Navigation/NavBarV2/types';

describe('NavigationMobileLink', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const mockTrackNavigationEvent = jest.fn();
  jest.spyOn(navigationHook, 'useNavigationTracking').mockImplementation(() => {
    return {
      trackNavigationEvent: mockTrackNavigationEvent,
    };
  });
  it('renders', () => {
    const mockItem: NavigationItem = {
      id: 'mockItem',
      label: 'Label',
      onClick: jest.fn(),
      url: '/mockUrl',
    };
    const { container } = render(<NavigationMobileLink item={mockItem} />);
    expect(container).toMatchSnapshot();
  });
  it('should call the trackNavigationEvent and onclick when the item is clicked', async () => {
    const mockOnClick = jest.fn();
    const mockItem: NavigationItem = {
      id: 'mockItem',
      label: 'Label',
      onClick: mockOnClick,
      url: '/mockUrl',
    };
    render(<NavigationMobileLink item={mockItem} />);
    const link = screen.getByText(mockItem.label);
    await userEvent.click(link);
    expect(mockOnClick).toHaveBeenCalled();
    expect(mockTrackNavigationEvent).toHaveBeenCalledWith(mockItem.id);
  });
});
