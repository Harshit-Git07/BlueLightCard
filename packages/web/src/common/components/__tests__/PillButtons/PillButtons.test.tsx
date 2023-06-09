import PillButtons from '@/components/PillButtons/PillButtons';
import { PillButtonProps } from '@/components/PillButtons/types';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup';

describe('PillButtons component', () => {
  let props: PillButtonProps;
  let user: UserEvent;

  beforeEach(() => {
    props = {
      pills: [
        { text: 'Pill 1', value: 'first-pill' },
        { text: 'Pill 2', value: 'second-pill' },
        { text: 'Pill 3', value: 'third-pill' },
      ],
    };
    user = userEvent.setup();
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

  describe('component functionality', () => {
    it('should select a pill on click', async () => {
      render(<PillButtons {...props} />);

      const pillButton = screen.getByText(/pill 1/i);
      await act(() => user.click(pillButton));

      expect(pillButton).toHaveClass(
        'bg-background-cta-toggle-selected-base dark:bg-background-cta-toggle-selected-dark text-font-cta-toggle-selected-base dark:text-font-cta-toggle-selected-dark'
      );
    });
  });

  describe('component callbacks', () => {
    it('should invoke onSelected callback with updated selected values', async () => {
      const onSelectedMockFn = jest.fn();
      props.onSelected = onSelectedMockFn;

      render(<PillButtons {...props} />);

      const pillButtonOne = screen.getByText(/pill 1/i);
      const pillButtonThree = screen.getByText(/pill 3/i);
      await act(() => user.click(pillButtonOne));
      await act(() => user.click(pillButtonThree));

      expect(onSelectedMockFn).toHaveBeenCalledWith(['third-pill', 'first-pill']);
    });
  });

  describe('component callbacks', () => {
    it('should invoke onSelected callback with updated deselected values', async () => {
      const onSelectedMockFn = jest.fn();
      props.onSelected = onSelectedMockFn;

      render(<PillButtons {...props} />);

      const pillButtonOne = screen.getByText(/pill 1/i);
      const pillButtonThree = screen.getByText(/pill 3/i);

      // Simulate selecting the pills
      await act(() => user.click(pillButtonOne));
      await act(() => user.click(pillButtonThree));
      // Simulate deselecting the first pill
      await act(() => user.click(pillButtonOne));

      expect(onSelectedMockFn).toHaveBeenCalledWith(['third-pill']);
    });
  });
});
