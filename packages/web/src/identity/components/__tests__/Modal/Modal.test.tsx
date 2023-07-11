import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Modal from '../../Modal/Modal';
import { ModalProps, ModalTypes } from '../../Modal/Types';
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup';
import userEvent from '@testing-library/user-event';

describe('Modal component', () => {
  let props: ModalProps;
  let user: UserEvent;
  beforeEach(() => {
    props = {
      isVisible: true,
      type: ModalTypes.QuitEligibility,
      onClose: jest.fn(),
      onConfirm: jest.fn(),
    };
    user = userEvent.setup();
  });

  describe('smoke test', () => {
    it('while isVisible is true, should render component without error', () => {
      render(<Modal {...props} />);

      const modal = screen.getByRole('article');
      expect(modal).toBeTruthy();
    });

    it('while isVisible is false, should not render component', () => {
      const modal = render(
        <Modal
          isVisible={false}
          type={props.type}
          onClose={props.onClose}
          onConfirm={props.onConfirm}
        />
      );
      //innerHtml should be empty as the article tag is no longer rendered while isVisible == false
      expect(modal.container.innerHTML).toStrictEqual('');
    });
  });
  describe('QuitEligibility event handling', () => {
    it('should invoke onClose when quit button is clicked', async () => {
      render(<Modal {...props} />);

      await act(() => user.click(screen.getByText('Quit')));

      expect(props.onClose).toHaveBeenCalled();
    });
    it('should invoke onConfirm when continue button is clicked', async () => {
      render(<Modal {...props} />);

      await act(() => user.click(screen.getByText('Continue')));

      expect(props.onConfirm).toHaveBeenCalled();
    });
  });
});
