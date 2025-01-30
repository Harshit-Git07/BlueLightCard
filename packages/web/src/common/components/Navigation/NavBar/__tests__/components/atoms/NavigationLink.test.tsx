jest.mock('../../../hooks/useNavigationTracking', () => ({
  useNavigationTracking: jest.fn(),
}));

import * as navigationHook from '../../../hooks/useNavigationTracking';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NavigationLink from '../../../components/atoms/NavigationLink';
import { NavigationItem } from '../../../types';

describe('NavigationLink', () => {
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
    const { container } = render(<NavigationLink item={mockItem} />);
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
    render(<NavigationLink item={mockItem} />);
    const link = screen.getByText(mockItem.label);
    await userEvent.click(link);
    expect(mockOnClick).toHaveBeenCalled();
    expect(mockTrackNavigationEvent).toHaveBeenCalledWith(mockItem.id);
  });
});
