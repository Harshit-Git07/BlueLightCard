import PillButtons, { Props } from './';
import { act, render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { UserEvent } from '@testing-library/user-event';

describe('PillButtons component', () => {
  let props: Props;
  let user: UserEvent;

  beforeEach(() => {
    props = {
      text: 'Pill 1',
      onSelected: () => void 0,
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

      expect(pill1).toBeInTheDocument();
    });
  });

  describe('component functionality', () => {
    it('should select a pill on click', async () => {
      const onSelected = jest.fn();

      const { getByRole } = render(
        <PillButtons text="Test" onSelected={onSelected} isSelected={false} />,
      );

      fireEvent.click(getByRole('button'));

      expect(getByRole('button')).toHaveClass(
        `font-pill-label-font text-pill-label-font font-pill-label-font-weight tracking-pill-label-font leading-pill-label-font rounded-full px-3 whitespace-nowrap min-w-[54px]`,
      );
    });

    describe('component callbacks', () => {
      it('should call onSelected function when clicked', () => {
        const onSelected = jest.fn();

        const { getByRole } = render(
          <PillButtons text="Test" onSelected={onSelected} isSelected={false} />,
        );

        fireEvent.click(getByRole('button'));
        expect(onSelected).toHaveBeenCalled();
      });

      it('should invoke onSelected callback with updated deselected values', async () => {
        const onSelectedMockFn = jest.fn();
        props.onSelected = onSelectedMockFn;
        props.disabled = true;

        render(<PillButtons {...props} />);

        const pillButtonOne = screen.getByText(/pill 1/i);

        await act(() => user.click(pillButtonOne));
        expect(pillButtonOne).toBeDisabled();
      });
    });
  });
});
