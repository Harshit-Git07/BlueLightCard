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

  describe('onClickLink', () => {
    it('should render onClickLink for parent item', () => {
      let onClickLinkCalled = false;
      render(
        <DesktopNavigation
          menu={[
            {
              text: 'Discover savings',
              link: '/discover',
              onClickLink: (_target: string) => {
                onClickLinkCalled = true;
                return Promise.resolve();
              },
            },
          ]}
        />
      );
      const navLink = screen.getByRole('link', { name: 'Discover savings' });
      navLink.click();

      expect(onClickLinkCalled).toBeTruthy();
    });

    it('should render onClickLink for dropdown item', () => {
      let onClickLinkCalled = false;
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
                  onClickLink: (_target: string) => {
                    onClickLinkCalled = true;
                    return Promise.resolve();
                  },
                },
              ],
            },
          ]}
        />
      );
      const navLink = screen.getByRole('link', { name: 'Holidays' });
      navLink.click();

      expect(onClickLinkCalled).toBeTruthy();
    });
  });
});
