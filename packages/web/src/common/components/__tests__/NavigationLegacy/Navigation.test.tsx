import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { CountrySelector, NavigationProps, NavItem } from '@/components/NavigationLegacy/types';
import Navigation from '@/components/NavigationLegacy/Navigation';

describe('Navigation component', () => {
  let props: NavigationProps;

  describe('props does not have nav items', () => {
    const navItems: [] = [];
    const loginLink = undefined;
    const signUpLink = undefined;
    const countries: CountrySelector[] = [];
    const countryKey = 'uk';
    const showFlag = true;

    beforeEach(() => {
      props = { navItems, loginLink, signUpLink, countries, countryKey, showFlag };
    });

    it('should not display nav items', () => {
      render(<Navigation {...props} />);

      const links = screen.getAllByRole('link');

      expectOnlyBrandLogoLinkToDisplay(links);
    });

    it('should not display mobile navigation menu', () => {
      render(<Navigation {...props} />);

      const mobileNavigationButton = screen.queryByLabelText('Open mobile navigation menu');

      expect(mobileNavigationButton).not.toBeInTheDocument();
    });
  });

  describe('props has nav items', () => {
    const navItems: [NavItem, NavItem] = [
      {
        link: '/home',
        text: 'Home',
      },
      {
        link: '/about-us',
        text: 'About us',
      },
    ];
    const loginLink = undefined;
    const signUpLink = undefined;
    const countries: CountrySelector[] = [];
    const countryKey = 'uk';
    const showFlag = true;

    beforeEach(() => {
      props = { navItems, loginLink, signUpLink, countries, countryKey, showFlag };
    });

    it('should display nav items', () => {
      render(<Navigation {...props} />);

      const links = screen.getAllByRole('link');

      expectLinksToDisplay(links, navItems[0].link, navItems[1].link);
    });

    it('should display mobile navigation menu', () => {
      render(<Navigation {...props} />);

      const mobileNavigationButton = screen.queryByLabelText('Open mobile navigation menu');

      expect(mobileNavigationButton).toBeInTheDocument;
    });
  });

  describe('props does not have login link', () => {
    const navItems: [] = [];
    const loginLink = undefined;
    const signUpLink = undefined;
    const countries: CountrySelector[] = [];
    const countryKey = 'uk';
    const showFlag = true;

    beforeEach(() => {
      props = { navItems, loginLink, signUpLink, countries, countryKey, showFlag };
    });

    it('should not display login link', () => {
      render(<Navigation {...props} />);

      const links = screen.getAllByRole('link');

      expectOnlyBrandLogoLinkToDisplay(links);
    });
  });

  describe('props has login link', () => {
    const navItems: [] = [];
    const loginLink = '/login';
    const signUpLink = undefined;
    const countries: CountrySelector[] = [];
    const countryKey = 'uk';
    const showFlag = true;

    beforeEach(() => {
      props = { navItems, loginLink, signUpLink, countries, countryKey, showFlag };
    });

    it('should display login link twice for hidden styling', () => {
      render(<Navigation {...props} />);

      const links = screen.getAllByRole('link');

      expectLinksToDisplay(links, '/login', '/login');
    });
  });

  describe('props does not have sign up link', () => {
    const navItems: [] = [];
    const loginLink = undefined;
    const signUpLink = undefined;
    const countries: CountrySelector[] = [];
    const countryKey = 'uk';
    const showFlag = true;

    beforeEach(() => {
      props = { navItems, loginLink, signUpLink, countries, countryKey, showFlag };
    });

    it('should not display sign up link', () => {
      render(<Navigation {...props} />);

      const links = screen.getAllByRole('link');

      expectOnlyBrandLogoLinkToDisplay(links);
    });
  });

  describe('props has sign up link', () => {
    const navItems: [] = [];
    const loginLink = undefined;
    const signUpLink = '/sign-up';
    const countries: CountrySelector[] = [];
    const countryKey = 'uk';
    const showFlag = true;

    beforeEach(() => {
      props = { navItems, loginLink, signUpLink, countries, countryKey, showFlag };
    });

    it('should display sign up link twice for hidden styling', () => {
      render(<Navigation {...props} />);

      const links = screen.getAllByRole('link');

      expectLinksToDisplay(links, '/sign-up', '/sign-up');
    });
  });

  describe('props has countries', () => {
    const navItems: [] = [];
    const loginLink = undefined;
    const signUpLink = undefined;
    const countries: CountrySelector[] = [
      {
        key: 'uk',
        name: 'United Kingdom',
        link: '/',
      },
      {
        key: 'aus',
        name: 'Australia',
        link: '/',
      },
    ];
    const countryKey = 'uk';
    const showFlag = true;

    beforeEach(() => {
      props = { navItems, loginLink, signUpLink, countries, countryKey, showFlag };
    });

    describe('and props has show flag set to false', () => {
      it('should not display country flags', () => {
        const showFlag = false;
        props = { navItems, loginLink, signUpLink, countries, countryKey, showFlag };

        render(<Navigation {...props} />);

        const countryButton = screen.queryByTitle(countries[0].name);

        expect(countryButton).not.toBeInTheDocument();
      });
    });

    describe('and props has show flag set to true', () => {
      it('should display country flags', () => {
        render(<Navigation {...props} />);

        const countryButton = screen.getByRole('button');

        expect(countryButton).toHaveAttribute('title', 'United Kingdom');
      });
    });

    describe('and props does not have selected country', () => {
      it('should not display country flags', () => {
        const countryKey = 'fr';
        props = { navItems, loginLink, signUpLink, countries, countryKey, showFlag };

        render(<Navigation {...props} />);

        const countryButton = screen.queryByTitle(countries[0].name);

        expect(countryButton).not.toBeInTheDocument();
      });
    });

    describe('and props has selected country', () => {
      it('should display country flags', () => {
        render(<Navigation {...props} />);

        const countryButton = screen.getByRole('button');

        expect(countryButton).toHaveAttribute('title', 'United Kingdom');
      });
    });
  });

  const expectOnlyBrandLogoLinkToDisplay = (links: HTMLElement[]) => {
    expect(links.length).toBe(1);
    expect(links[0]).toHaveAttribute('href', '/');
  };

  const expectLinksToDisplay = (
    links: HTMLElement[],
    expectedLinkOne: string,
    expectedLinkTwo: string
  ) => {
    //includes brand logo link
    expect(links.length).toBe(3);
    expect(links[1]).toHaveAttribute('href', expectedLinkOne);
    expect(links[2]).toHaveAttribute('href', expectedLinkTwo);
  };
});
