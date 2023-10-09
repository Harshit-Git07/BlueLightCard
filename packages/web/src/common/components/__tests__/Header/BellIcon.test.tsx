import { render, screen } from '@testing-library/react';
import BellIcon from '@/components/Header/BellIcon';

import headerConfig from '@/data/header.json';

describe('Bell Icon component', () => {
  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<BellIcon url={headerConfig.navItems.links.notificationsUrl} />);
      const link = screen.getByTestId('bell-icon');
      expect(link).toBeTruthy();
    });
  });

  describe('contains svg image icon', () => {
    it('should render bell icon without error', () => {
      const { container } = render(<BellIcon url={headerConfig.navItems.links.notificationsUrl} />);
      const svgElement = container.querySelector("[data-icon='bell']") as HTMLImageElement;
      expect(svgElement.classList.toString()).toContain('fa-bell');
    });
  });
});
