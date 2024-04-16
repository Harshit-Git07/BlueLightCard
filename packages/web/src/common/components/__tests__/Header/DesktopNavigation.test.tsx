import { render, screen } from '@testing-library/react';
import DesktopNavigation from '@/components/Header/DesktopNavigation';

describe('Desktop Navigation component', () => {
  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<DesktopNavigation menu={[]} />);
      const mobileNav = screen.getByTestId('desktopNav');
      expect(mobileNav).toBeTruthy();
    });
  });

  describe('text will render', () => {
    it('should render Home when parameter set', () => {
      render(
        <DesktopNavigation
          menu={[
            {
              text: 'Home',
              link: '/',
            },
          ]}
        />
      );
      const navItem = screen.getByText('Home');
      expect(navItem).toBeTruthy();
    });
  });

  describe('text will render', () => {
    it('should render Home when parameter set', () => {
      render(
        <DesktopNavigation
          menu={[
            {
              text: 'Home',
              link: '/',
            },
          ]}
        />
      );
      const listMenuItems = screen.getAllByRole('listitem');
      expect(listMenuItems.length).toBeGreaterThan(0);
    });
  });

  describe('text will render', () => {
    it('should render Holidays when parameter set', () => {
      render(
        <DesktopNavigation
          menu={[
            {
              text: 'Discover savings',
              link: '/discover',
              dropdown: [
                {
                  text: 'Holidays',
                  link: '/holidays',
                },
              ],
            },
          ]}
        />
      );
      const navItem = screen.getByText('Holidays');
      expect(navItem).toBeTruthy();
    });
  });

  describe('text will render', () => {
    it('should render Holidays when parameter set', () => {
      render(
        <DesktopNavigation
          menu={[
            {
              text: 'Discover savings',
              link: '/discover',
              dropdown: [
                {
                  text: 'Holidays',
                  link: '/holidays',
                },
              ],
            },
          ]}
        />
      );
      const listMenuItems = screen.getAllByRole('listitem');
      expect(listMenuItems.length).toBeGreaterThan(0);
    });
  });
});
