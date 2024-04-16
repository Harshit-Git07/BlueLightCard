import Header from '@/components/Header/Header';
import { render, screen } from '@testing-library/react';

describe('Header component', () => {
  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<Header />);

      const header = screen.getByTestId('app-header');

      expect(header).toBeTruthy();
    });
  });
});
