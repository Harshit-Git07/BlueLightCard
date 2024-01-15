import FilterHeader from '@/components/FilterHeader/FilterHeader';
import { FilterHeaderProps } from '@/components/FilterHeader/types';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

describe('FilterHeader component', () => {
  let props: FilterHeaderProps;

  beforeEach(() => {
    props = {
      onDoneClick: jest.fn(),
      onResetClick: jest.fn(),
      resetEnabled: true,
    };
  });

  describe('Smoke test', () => {
    it('should render component without error', () => {
      render(<FilterHeader {...props} />);
    });
  });

  describe('Component callbacks', () => {
    it('should invoke onDoneClick when user clicks done', async () => {
      render(<FilterHeader {...props} />);

      const doneButton = screen.getByRole('button', { name: 'Done' });

      await act(async () => {
        await userEvent.click(doneButton);
      });
      expect(props.onDoneClick).toHaveBeenCalled();
    });

    it('should invoke onResetClick when user clicks reset', async () => {
      render(<FilterHeader {...props} />);

      const resetButton = screen.getByRole('button', { name: 'Reset' });

      await act(async () => {
        await userEvent.click(resetButton);
      });
      expect(props.onResetClick).toHaveBeenCalled();
    });
  });

  describe('Reset button', () => {
    it('should be disabled when resetEnabled is false', () => {
      props.resetEnabled = false;
      render(<FilterHeader {...props} />);

      const resetButton = screen.getByRole('button', { name: 'Reset' });

      expect(resetButton).toBeDisabled();
    });
  });
});
