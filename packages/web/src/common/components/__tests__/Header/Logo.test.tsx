import { render, screen } from '@testing-library/react';
import React from 'react';
import Logo from '@/components/Header/Logo';

import { navLinks } from '@/data/headerConfig';

describe('Logo component', () => {
  describe('Logo is a link', () => {
    it('should render component without error', () => {
      render(<Logo url={navLinks.homeUrl} />);
      const link = screen.getByRole('link');
      expect(link).toBeTruthy();
    });
  });

  describe('Logo contains an image', () => {
    it('Should render the logo correctly', () => {
      render(<Logo url={navLinks.homeUrl} />);
      const logo = screen.getByAltText(/Navigate Home/i);
      expect(logo).toBeTruthy();
    });
  });
});
