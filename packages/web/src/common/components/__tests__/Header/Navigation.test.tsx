import { render, screen } from '@/root/test-utils';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import Navigation from '@/components/Header/Navigation';
import { NavProp } from '@/components/Header/types';
import { NextRouter } from 'next/router';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { redirect } from '@/utils/externalRedirect';
import { act } from '@testing-library/react';
import { HOLIDAY_URL } from '@/global-vars';

const logOffersClickedMock = jest.fn();
const logBrowseCategoriesClickedMock = jest.fn();
const logMyCardClickedMock = jest.fn();
const logMyAccountClickedMock = jest.fn();

let user: UserEvent;

const mockRouter: Partial<NextRouter> = {
  push: jest.fn(),
  prefetch: jest.fn(),
  query: {
    q: 'searchValue',
  },
};

jest.mock('@/hooks/useLogGlobalNavigation', () => ({
  useLogGlobalNavigationOffersClicked: jest.fn(() => ({
    logOffersClicked: logOffersClickedMock,
    logBrowseCategoriesClicked: logBrowseCategoriesClickedMock,
    logMyCardClicked: logMyCardClickedMock,
    logMyAccountClicked: logMyAccountClickedMock,
  })),
}));
jest.mock('@/utils/externalRedirect');
const redirectMock = jest.mocked(redirect);

const clickLink = async (link: HTMLElement) => {
  await act(async () => {
    await user.click(link);
  });
};
describe('Navigation component for logged in and logged out', () => {
  beforeEach(() => {
    user = userEvent.setup();
  });

  describe('Navigation component for logged in', () => {
    let props: NavProp;
    beforeEach(() => {
      props = {
        authenticated: true,
        displaySearch: false,
        setDisplaySearch: false,
      };
    });

    it('Should render the navigation menu with homepage', () => {
      givenNavigationIsRendered(props);
      const navLink = screen.getByRole('link', { name: 'Home' });
      expect(navLink).toHaveAttribute('href', '/members-home');
    });

    it('Should render the navigation menu with Offers link', () => {
      givenNavigationIsRendered(props);
      const navLink = screen.getByRole('link', { name: 'Offers' });
      expect(navLink).toHaveAttribute('href', '#');
    });

    it('Should render the navigation menu with Browse categories link', () => {
      givenNavigationIsRendered(props);
      const navLink = screen.getByRole('link', { name: 'Browse categories' });
      expect(navLink).toHaveAttribute('href', '#');
    });

    it.each([
      ['Online Discounts', '/offers.php?type=0'],
      ['High Street Offers', '/offers.php?type=5'],
      ['Popular Discounts', '/offers.php?type=3'],
      ['Giftcard Discounts', '/offers.php?type=2'],
      ['Offers Near You', '/nearme.php'],
      ['Deals of the Week', '/members-home'],
      ['Holiday Discounts', HOLIDAY_URL],
      ['Days Out', '/days-out.php'],
      ['My Card', '/highstreetcard.php'],
      ['My Account', '/account.php'],
    ])('Should render the navigation menu with %s that links to %s', async (link, url) => {
      givenNavigationIsRendered(props);
      const navLink = screen.getByRole('link', { name: link });
      await clickLink(navLink);

      expect(redirectMock).toHaveBeenCalledWith(url);
    });

    it('Should render the navigation menu with FAQs link', () => {
      givenNavigationIsRendered(props);
      const navLink = screen.getByRole('link', { name: 'FAQs' });
      expect(navLink).toHaveAttribute('href', '/support.php#questions');
    });

    it('Should render the navigation menu with Logout link', () => {
      givenNavigationIsRendered(props);
      const navLink = screen.getByRole('link', { name: 'Logout' });
      expect(navLink).toHaveAttribute('href', '/logout.php');
    });

    describe('Logged in navigation analytics', () => {
      it('Should trigger analytics when My Account clicked', async () => {
        givenNavigationIsRendered(props);
        await whenLinkIsClicked('My Account');

        expect(logMyAccountClickedMock).toHaveBeenCalled();
      });
      it('Should trigger analytics when My Card clicked', async () => {
        givenNavigationIsRendered(props);
        await whenLinkIsClicked('My Card');

        expect(logMyCardClickedMock).toHaveBeenCalled();
      });
      it.each(['Holiday Discounts', 'Days Out'])(
        "Should trigger analytics when Browse Categories - '%s' is clicked",
        async (link) => {
          givenNavigationIsRendered(props);
          await whenLinkIsClicked(link);

          expect(logBrowseCategoriesClickedMock).toHaveBeenCalledWith(link);
        }
      );
      it.each([
        'Online Discounts',
        'Giftcard Discounts',
        'High Street Offers',
        'Popular Discounts',
        'Offers Near You',
        'Deals of the Week',
      ])("Should trigger analytics when Offers - '%s' is clicked", async (link) => {
        givenNavigationIsRendered(props);
        await whenLinkIsClicked(link);

        expect(logOffersClickedMock).toHaveBeenCalledWith(link);
      });
      const whenLinkIsClicked = async (label: string) => {
        const navLink = screen.getByRole('link', { name: label });
        await clickLink(navLink);
      };
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
    it.each([
      ['Home', '/'],
      ['About us', '/about_blue_light_card.php'],
      ['Add your business', '/addaforcesdiscount.php'],
      ['FAQs', '/contactblc.php'],
      ['Days Out', '/days-out.php'],
      ['Holidays', '/holiday-discounts.php'],
      ['Discover savings', '#'],
      ['Register now', '/newuser.php'],
      ['Login', '/login.php'],
    ])("Should trigger analytics when Offers - '%s' is clicked", (label, url) => {
      givenNavigationIsRendered(props);
      const navLink = screen.getByRole('link', { name: label });
      expect(navLink).toHaveAttribute('href', url);
    });
  });
});

const givenNavigationIsRendered = (props: NavProp) => {
  render(
    <RouterContext.Provider value={mockRouter as NextRouter}>
      <Navigation {...props} />
    </RouterContext.Provider>
  );
};
