import { render, screen } from '@/root/test-utils';
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
      };
    });
    describe('Logged in navigation contains homepage link', () => {
      it('Should render the navigation menu with homepage', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'Home' });
        expect(navLink).toHaveAttribute('href', '/members-home');
      });
    });
    describe('Logged in navigation contains Offers link', () => {
      it('Should render the navigation menu with Offers link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'Offers' });
        expect(navLink).toHaveAttribute('href', '#');
      });
    });
    describe('Logged in navigation contains Online Discounts link', () => {
      it('Should render the navigation menu with Online Discounts link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'Online Discounts' });
        expect(navLink).toHaveAttribute('href', '/offers.php?type=0');
      });
    });
    describe('Logged in navigation contains High Street Offers link', () => {
      it('Should render the navigation menu with High Street Offers link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'High Street Offers' });
        expect(navLink).toHaveAttribute('href', '/offers.php?type=5');
      });
    });
    describe('Logged in navigation contains Popular Discounts link', () => {
      it('Should render the navigation menu with Popular Discounts link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'Popular Discounts' });
        expect(navLink).toHaveAttribute('href', '/offers.php?type=3');
      });
    });
    describe('Logged in navigation contains Giftcards Discounts link', () => {
      it('Should render the navigation menu with Giftcards link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'Giftcard Discounts' });
        expect(navLink).toHaveAttribute('href', '/offers.php?type=2');
      });
    });
    describe('Logged in navigation contains Offers near you Discounts link', () => {
      it('Should render the navigation menu with Offers near you link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'Offers Near You' });
        expect(navLink).toHaveAttribute('href', '/nearme.php');
      });
    });
    describe('Logged in navigation contains Deals of the week Discounts link', () => {
      it('Should render the navigation menu with Deals of the week link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'Deals of the Week' });
        expect(navLink).toHaveAttribute('href', '/members-home');
      });
    });
    describe('Logged in navigation contains Browse categories link', () => {
      it('Should render the navigation menu with Browse categories link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'Browse categories' });
        expect(navLink).toHaveAttribute('href', '#');
      });
    });
    describe('Logged in navigation contains Holiday Discounts link', () => {
      it('Should render the navigation menu with Holiday Discounts link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'Holiday Discounts' });
        expect(navLink).toHaveAttribute('href', '/holiday-discounts.php');
      });
    });
    describe('Logged in navigation contains Days Out link', () => {
      it('Should render the navigation menu with Days Out link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'Days Out' });
        expect(navLink).toHaveAttribute('href', '/days-out.php');
      });
    });
    describe('Logged in navigation contains My Card link', () => {
      it('Should render the navigation menu with My Card link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'My Card' });
        expect(navLink).toHaveAttribute('href', '/highstreetcard.php');
      });
    });
    describe('Logged in navigation contains My Account link', () => {
      it('Should render the navigation menu with My Account link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'My Account' });
        expect(navLink).toHaveAttribute('href', '/account.php');
      });
    });
    describe('Logged in navigation contains FAQs link', () => {
      it('Should render the navigation menu with FAQs link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'FAQs' });
        expect(navLink).toHaveAttribute('href', '/support.php#questions');
      });
    });
    describe('Logged in navigation contains Logout link', () => {
      it('Should render the navigation menu with Logout link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'Logout' });
        expect(navLink).toHaveAttribute('href', '/logout.php');
      });
    });
  });

  describe('Navigation component for logged out', () => {
    let props: NavProp;
    beforeEach(() => {
      props = {
        authenticated: false,
        displaySearch: false,
        setDisplaySearch: false,
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
        expect(navLink).toHaveAttribute('href', '/about_blue_light_card.php');
      });
    });
    describe('Logged out navigation contains Add your business link', () => {
      it('Should render the navigation menu with Add your business link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'Add your business' });
        expect(navLink).toHaveAttribute('href', '/addaforcesdiscount.php');
      });
    });
    describe('Logged out navigation contains FAQs link', () => {
      it('Should render the navigation menu with FAQs link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'FAQs' });
        expect(navLink).toHaveAttribute('href', '/contactblc.php');
      });
    });
    describe('Logged out navigation contains Days out link', () => {
      it('Should render the navigation menu with Days out link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'Days Out' });
        expect(navLink).toHaveAttribute('href', '/days-out.php');
      });
    });
    describe('Logged out navigation contains Holidays link', () => {
      it('Should render the navigation menu with Holidays link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'Holidays' });
        expect(navLink).toHaveAttribute('href', '/holiday-discounts.php');
      });
    });
    describe('Logged out navigation contains Discover Savings link', () => {
      it('Should render the navigation menu with Discover Savings link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'Discover savings' });
        expect(navLink).toHaveAttribute('href', '#');
      });
    });
    describe('Logged out navigation contains Register now link', () => {
      it('Should render the navigation menu with Register now link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'Register now' });
        expect(navLink).toHaveAttribute('href', '/newuser.php');
      });
    });
    describe('Logged out navigation contains Login link', () => {
      it('Should render the navigation menu with Login link', () => {
        render(<Navigation {...props} />);
        const navLink = screen.getByRole('link', { name: 'Login' });
        expect(navLink).toHaveAttribute('href', '/login.php');
      });
    });
  });
});
