import { render, screen } from '@testing-library/react';
import List from '@/components/Header/List';

describe('Country Link component', () => {
  describe('smoke test', () => {
    it('should render component without error', () => {
      render(
        <List
          country={{
            key: '',
            name: '',
            link: '',
          }}
        />
      );
      const list = screen.getByTestId('countryList');
      expect(list).toBeTruthy();
    });
  });

  describe('text will render', () => {
    it('should render United Kingdom when parameter set', () => {
      render(
        <List
          country={{
            key: 'uk',
            name: 'United Kingdom ',
            link: '/',
          }}
        />
      );
      const country = screen.getByText('United Kingdom');
      expect(country).toBeTruthy();
    });
  });

  describe('text will render', () => {
    it('should render United Kingdom when parameter set', () => {
      render(
        <List
          country={{
            key: 'uk',
            name: 'United Kingdom ',
            link: '/',
          }}
        />
      );

      const country = screen.getAllByRole('listitem');
      expect(country.length).toBeGreaterThan(0);
    });
  });
});
