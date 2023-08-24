import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import Navigation from '@/components/Header/Navigation';
import { NavProp } from '@/components/Header/types';

describe('Navigation component for logged in and logged out', () => {
  describe('Navigation component for logged in', () => {
    let props: NavProp;
    beforeEach(() => {
      props = {
        authenticated: true,
        displaySearch: false,
        setDisplaySearch: false,
        navItems: {
          loggedIn: [
            {
              text: 'Home',
              link: '/memhome',
              dropdown: [
                {
                  text: '',
                  link: '',
                },
              ],
            },
            {
              text: 'Offers',
              link: '/offers',
              dropdown: [
                {
                  text: '',
                  link: '',
                },
              ],
            },
            {
              text: 'Online Discounts',
              link: '/online',
              dropdown: [
                {
                  text: '',
                  link: '',
                },
              ],
            },
            {
              text: 'High Street Offers',
              link: '/highstreet',
              dropdown: [
                {
                  text: '',
                  link: '',
                },
              ],
            },
            {
              text: 'Popular Discounts',
              link: '/popular',
              dropdown: [
                {
                  text: '',
                  link: '',
                },
              ],
            },
            {
              text: 'Giftcard Discounts',
              link: '/giftcard',
              dropdown: [
                {
                  text: '',
                  link: '',
                },
              ],
            },
            {
              text: 'Offers Near You',
              link: '/nearyou',
              dropdown: [
                {
                  text: '',
                  link: '',
                },
              ],
            },
            {
              text: 'Deals of the Week',
              link: '/dotw',
              dropdown: [
                {
                  text: '',
                  link: '',
                },
              ],
            },
            {
              text: 'Browse categories',
              link: '/browse',
              dropdown: [
                {
                  text: '',
                  link: '',
                },
              ],
            },
            {
              text: 'Holiday Discounts',
              link: '/holidays',
              dropdown: [
                {
                  text: '',
                  link: '',
                },
              ],
            },
            {
              text: 'Days Out',
              link: '/daysout',
              dropdown: [
                {
                  text: '',
                  link: '',
                },
              ],
            },
            {
              text: 'My Card',
              link: '/mycard',
              dropdown: [
                {
                  text: '',
                  link: '',
                },
              ],
            },
            {
              text: 'My Account',
              link: '/account',
              dropdown: [
                {
                  text: '',
                  link: '',
                },
              ],
            },
            {
              text: 'FAQs',
              link: '/faqs',
              dropdown: [
                {
                  text: '',
                  link: '',
                },
              ],
            },
            {
              text: 'Logout',
              link: '/logout',
              dropdown: [
                {
                  text: '',
                  link: '',
                },
              ],
            },
          ],
          loggedOut: [
            {
              text: '',
              link: '',
              dropdown: [
                {
                  text: '',
                  link: '',
                },
              ],
            },
          ],
        },
      };
    });
    describe('Logged in navigation contains homepage link', () => {
      it('Should render the navigation menu with homepage', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'Home' });
        expect(navLink).toHaveAttribute('href', '/memhome');
      });
    });
    describe('Logged in navigation contains Offers link', () => {
      it('Should render the navigation menu with Offers link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'Offers' });
        expect(navLink).toHaveAttribute('href', '/offers');
      });
    });
    describe('Logged in navigation contains Online Discounts link', () => {
      it('Should render the navigation menu with Online Discounts link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'Online Discounts' });
        expect(navLink).toHaveAttribute('href', '/online');
      });
    });
    describe('Logged in navigation contains High Street Offers link', () => {
      it('Should render the navigation menu with High Street Offers link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'High Street Offers' });
        expect(navLink).toHaveAttribute('href', '/highstreet');
      });
    });
    describe('Logged in navigation contains Popular Discounts link', () => {
      it('Should render the navigation menu with Popular Discounts link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'Popular Discounts' });
        expect(navLink).toHaveAttribute('href', '/popular');
      });
    });
    describe('Logged in navigation contains Giftcards Discounts link', () => {
      it('Should render the navigation menu with Giftcards link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'Giftcard Discounts' });
        expect(navLink).toHaveAttribute('href', '/giftcard');
      });
    });
    describe('Logged in navigation contains Offers near you Discounts link', () => {
      it('Should render the navigation menu with Offers near you link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'Offers Near You' });
        expect(navLink).toHaveAttribute('href', '/nearyou');
      });
    });
    describe('Logged in navigation contains Deals of the week Discounts link', () => {
      it('Should render the navigation menu with Deals of the week link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'Deals of the Week' });
        expect(navLink).toHaveAttribute('href', '/dotw');
      });
    });
    describe('Logged in navigation contains Browse categories link', () => {
      it('Should render the navigation menu with Browse categories link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'Browse categories' });
        expect(navLink).toHaveAttribute('href', '/browse');
      });
    });
    describe('Logged in navigation contains Holiday Discounts link', () => {
      it('Should render the navigation menu with Holiday Discounts link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'Holiday Discounts' });
        expect(navLink).toHaveAttribute('href', '/holidays');
      });
    });
    describe('Logged in navigation contains Days Out link', () => {
      it('Should render the navigation menu with Days Out link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'Days Out' });
        expect(navLink).toHaveAttribute('href', '/daysout');
      });
    });
    describe('Logged in navigation contains My Card link', () => {
      it('Should render the navigation menu with My Card link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'My Card' });
        expect(navLink).toHaveAttribute('href', '/mycard');
      });
    });
    describe('Logged in navigation contains My Account link', () => {
      it('Should render the navigation menu with My Account link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'My Account' });
        expect(navLink).toHaveAttribute('href', '/account');
      });
    });
    describe('Logged in navigation contains FAQs link', () => {
      it('Should render the navigation menu with FAQs link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'FAQs' });
        expect(navLink).toHaveAttribute('href', '/faqs');
      });
    });
    describe('Logged in navigation contains Logout link', () => {
      it('Should render the navigation menu with Logout link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'Logout' });
        expect(navLink).toHaveAttribute('href', '/logout');
      });
    });
  });

  describe('Navigation component for logged out', () => {
    let props: NavProp;
    beforeEach(() => {
      props = {
        authenticated: true,
        displaySearch: false,
        setDisplaySearch: false,
        navItems: {
          loggedIn: [
            {
              text: 'Home',
              link: '/',
              dropdown: [
                {
                  text: '',
                  link: '',
                },
              ],
            },
            {
              text: 'About us',
              link: '/about',
              dropdown: [
                {
                  text: '',
                  link: '',
                },
              ],
            },
            {
              text: 'Add your business',
              link: '/addbusiness',
              dropdown: [
                {
                  text: '',
                  link: '',
                },
              ],
            },
            {
              text: 'FAQs',
              link: '/faqs',
              dropdown: [
                {
                  text: '',
                  link: '',
                },
              ],
            },
            {
              text: 'Days Out',
              link: '/daysout',
              dropdown: [
                {
                  text: '',
                  link: '',
                },
              ],
            },
            {
              text: 'Holidays',
              link: '/holidays',
              dropdown: [
                {
                  text: '',
                  link: '',
                },
              ],
            },
            {
              text: 'Discover savings',
              link: '/discover',
              dropdown: [
                {
                  text: '',
                  link: '',
                },
              ],
            },
            {
              text: 'Register now',
              link: '/newaccount',
              dropdown: [
                {
                  text: '',
                  link: '',
                },
              ],
            },
            {
              text: 'Login',
              link: '/login',
              dropdown: [
                {
                  text: '',
                  link: '',
                },
              ],
            },
          ],
          loggedOut: [
            {
              text: '',
              link: '',
              dropdown: [
                {
                  text: '',
                  link: '',
                },
              ],
            },
          ],
        },
      };
    });
    describe('Logged out navigation contains homepage link', () => {
      it('Should render the navigation menu with homepage', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'Home' });
        expect(navLink).toHaveAttribute('href', '/');
      });
    });
    describe('Logged out navigation contains About us link', () => {
      it('Should render the navigation menu with About us link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'About us' });
        expect(navLink).toHaveAttribute('href', '/about');
      });
    });
    describe('Logged out navigation contains Add your business link', () => {
      it('Should render the navigation menu with Add your business link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'Add your business' });
        expect(navLink).toHaveAttribute('href', '/addbusiness');
      });
    });
    describe('Logged out navigation contains FAQs link', () => {
      it('Should render the navigation menu with FAQs link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'FAQs' });
        expect(navLink).toHaveAttribute('href', '/faqs');
      });
    });
    describe('Logged out navigation contains Days out link', () => {
      it('Should render the navigation menu with Days out link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'Days Out' });
        expect(navLink).toHaveAttribute('href', '/daysout');
      });
    });
    describe('Logged out navigation contains Holidays link', () => {
      it('Should render the navigation menu with Holidays link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'Holidays' });
        expect(navLink).toHaveAttribute('href', '/holidays');
      });
    });
    describe('Logged out navigation contains Discover Savings link', () => {
      it('Should render the navigation menu with Discover Savings link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'Discover savings' });
        expect(navLink).toHaveAttribute('href', '/discover');
      });
    });
    describe('Logged out navigation contains Register now link', () => {
      it('Should render the navigation menu with Register now link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'Register now' });
        expect(navLink).toHaveAttribute('href', '/newaccount');
      });
    });
    describe('Logged out navigation contains Login link', () => {
      it('Should render the navigation menu with Login link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'Login' });
        expect(navLink).toHaveAttribute('href', '/login');
      });
    });
  });
});
