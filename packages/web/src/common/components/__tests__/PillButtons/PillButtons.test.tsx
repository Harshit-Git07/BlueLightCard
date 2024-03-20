import PillButtons from '@/components/PillButtons/PillButtons';
import { PillButtonProps } from '@/components/PillButtons/types';
import { act, render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup';

describe('PillButtons component', () => {
  let props: PillButtonProps;
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
        <PillButtons text="Test" onSelected={onSelected} isSelected={false} />
      );

      fireEvent.click(getByRole('button'));

      expect(getByRole('button')).toHaveClass(
        `bg-[#ECEFF2] font-['MuseoSans'] text-[#202125] font-light rounded-[56px] desktop:py-3 px-3 mobile:py-2 whitespace-nowrap text-base`
      );
    });

    describe('component callbacks', () => {
      it('should call onSelected function when clicked', () => {
        const onSelected = jest.fn();

        const { getByRole } = render(
          <PillButtons text="Test" onSelected={onSelected} isSelected={false} />
        );

        fireEvent.click(getByRole('button'));
        expect(onSelected).toHaveBeenCalledWith('Test');
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
