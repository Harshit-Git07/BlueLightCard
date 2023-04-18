import PillButtons from '@/components/PillButtons/PillButtons';
import { PillButtonProps } from '@/components/PillButtons/types';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('PillButtons component', () => {
  let props: PillButtonProps;

  beforeEach(() => {
    props = { pills: ['Pill 1', 'Pill 2', 'Pill 3'] };
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<PillButtons {...props} />);
    });
  });

  describe('component rendering', () => {
    it('should output text inside of the pill buttons', () => {
      render(<PillButtons {...props} />);

      const pill1 = screen.getByText(/pill 1/i);
      const pill2 = screen.getByText(/pill 2/i);
      const pill3 = screen.getByText(/pill 3/i);

      expect(pill1).toBeInTheDocument();
      expect(pill2).toBeInTheDocument();
      expect(pill3).toBeInTheDocument();
    });
  });
});
