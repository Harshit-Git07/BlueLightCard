import { render, screen } from '@testing-library/react';
import React from 'react';
import Logo from '@/components/Header/Logo';

describe('Logo component', () => {
  describe('Logo is a link', () => {
    it('should render component without error', () => {
      render(<Logo logoUrl={'https://www.test.com'} />);
      const link = screen.getByRole('link');
      expect(link).toBeTruthy();
    });
  });

  describe('Logo contains an image', () => {
    it('Should render the logo correctly', () => {
      render(<Logo logoUrl={'https://www.test.com'} />);
      const logo = screen.getByRole('img');
      expect(logo).toBeTruthy();
    });
  });
});
