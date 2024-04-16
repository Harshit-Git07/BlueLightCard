import { render, screen } from '@testing-library/react';
import BellIcon from '@/components/Header/BellIcon';

import { navLinks } from '@/data/headerConfig';

const logNotificationsClickedMock = jest.fn();
jest.mock('@/hooks/useLogGlobalNavigation', () => ({
  useLogGlobalNavigationOffersClicked: jest.fn(() => ({
    logNotificationsClicked: logNotificationsClickedMock,
  })),
}));

describe('Bell Icon component', () => {
  it('should render component without error', () => {
    render(<BellIcon url={navLinks.notificationsUrl} />);

    const link = screen.getByTestId('bell-icon');
    expect(link).toBeTruthy();
  });
  it('should render bell icon without error', () => {
    const { container } = render(<BellIcon url={navLinks.notificationsUrl} />);

    const svgElement = container.querySelector("[data-icon='bell']") as HTMLImageElement;
    expect(svgElement.classList.toString()).toContain('fa-bell');
  });
  it('should trigger analytics when clicked', () => {
    render(<BellIcon url={navLinks.notificationsUrl} />);

    const link = screen.getByLabelText("Notification's");
    link.click();

    expect(logNotificationsClickedMock).toHaveBeenCalled();
  });
});
