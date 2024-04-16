import { render, screen } from '@testing-library/react';
import MobileNavigation from '@/components/Header/MobileNavigation';

describe('Mobile Navigation component', () => {
  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<MobileNavigation menu={[]} />);
      const mobileNav = screen.getByTestId('mobileNav');
      expect(mobileNav).toBeTruthy();
    });
  });

  describe('text will render', () => {
    it('should render Home when parameter set', () => {
      render(
        <MobileNavigation
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
        <MobileNavigation
          menu={[
            {
              text: 'Home',
              link: '/',
            },
          ]}
        />
      );
      const navItem = screen.getAllByRole('listitem');
      expect(navItem.length).toBeGreaterThan(0);
    });
  });

  describe('text will render', () => {
    it('should render Holidays when parameter set', () => {
      render(
        <MobileNavigation
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
        <MobileNavigation
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
      const navItem = screen.getAllByRole('listitem');
      expect(navItem.length).toBeGreaterThan(0);
    });
  });

  describe('onClickLink', () => {
    it('should render onClickLink for parent item', () => {
      let onClickLinkCalled = false;
      render(
        <MobileNavigation
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
        <MobileNavigation
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
