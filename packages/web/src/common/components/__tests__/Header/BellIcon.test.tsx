import { render, screen } from '@testing-library/react';
import BellIcon from '@/components/Header/BellIcon';

import { navItems } from '@/data/headerConfig';

describe('Bell Icon component', () => {
  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<BellIcon url={navItems.links.notificationsUrl} />);
      const link = screen.getByTestId('bell-icon');
      expect(link).toBeTruthy();
    });
  });

  describe('contains svg image icon', () => {
    it('should render bell icon without error', () => {
      const { container } = render(<BellIcon url={navItems.links.notificationsUrl} />);
      const svgElement = container.querySelector("[data-icon='bell']") as HTMLImageElement;
      expect(svgElement.classList.toString()).toContain('fa-bell');
    });
  });
});
