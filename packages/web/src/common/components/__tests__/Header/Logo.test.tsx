import { render, screen } from '@testing-library/react';
import React from 'react';
import Logo from '@/components/Header/Logo';

import headerConfig from '@/data/header.json';

describe('Logo component', () => {
  describe('Logo is a link', () => {
    it('should render component without error', () => {
      render(<Logo url={headerConfig.navItems.links.homeUrl} />);
      const link = screen.getByRole('link');
      expect(link).toBeTruthy();
    });
  });

  describe('Logo contains an image', () => {
    it('Should render the logo correctly', () => {
      render(<Logo url={headerConfig.navItems.links.homeUrl} />);
      const logo = screen.getByAltText(/Blue Light Card Logo/i);
      expect(logo).toBeTruthy();
    });
  });
});
