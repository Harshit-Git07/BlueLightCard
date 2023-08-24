import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import SelectCountry from '@/components/Header/SelectCountry';

describe('SelectCountry component', () => {
  describe('SelectCountry is rendered', () => {
    it('should render component without error', () => {
      render(<SelectCountry />);
    });
  });

  describe('SelectCountry is clickable', () => {
    it('display options without error', () => {
      render(<SelectCountry />);
      const selectCountry = screen.getByRole('button');
      expect(selectCountry).toBeTruthy();
    });
  });
});
