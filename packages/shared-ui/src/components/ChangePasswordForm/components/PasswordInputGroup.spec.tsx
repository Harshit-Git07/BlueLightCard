import { PasswordInputGroup, PasswordInputGroupProps } from './PasswordInputGroup';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CurrentFormState } from '../types';
import { PasswordFields } from '../constants';
import { act } from 'react';

const mockUpdateValue = jest.fn();

const defaultProps: PasswordInputGroupProps = {
  formState: {
    [PasswordFields.current]: { value: '', error: '' },
    [PasswordFields.new]: { value: '', error: '' },
    [PasswordFields.confirm]: { value: '', error: '' },
  },
  updatePasswordValue: mockUpdateValue,
};

describe('PasswordInputGroup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('matches snapshot in default state', () => {
    const { container } = render(<PasswordInputGroup {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot in populated state', () => {
    const populatedState: CurrentFormState = {
      [PasswordFields.current]: { value: 'testCurrentPassword', error: '' },
      [PasswordFields.new]: { value: 'testNewPassword', error: '' },
      [PasswordFields.confirm]: { value: 'testNewPasswordConfirm', error: '' },
    };
    const { container } = render(
      <PasswordInputGroup {...defaultProps} formState={populatedState} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('calls updatePasswordValue with correct parameters when input changes', async () => {
    render(<PasswordInputGroup {...defaultProps} />);

    const currentPasswordInput = screen.getAllByLabelText(/current password/i)[0];
    await userEvent.type(currentPasswordInput, 'a');
    expect(mockUpdateValue).toHaveBeenLastCalledWith('a', PasswordFields.current);

    const newPasswordInput = screen.getAllByLabelText(/new password/i)[0];
    await userEvent.type(newPasswordInput, 'b');
    expect(mockUpdateValue).toHaveBeenLastCalledWith('b', PasswordFields.new);

    const confirmPasswordInput = screen.getAllByLabelText(/confirm new password/i)[0];
    await userEvent.type(confirmPasswordInput, 'c');
    expect(mockUpdateValue).toHaveBeenLastCalledWith('c', PasswordFields.confirm);
  });

  describe('Validation logic (isValid)', () => {
    it('marks field as valid if it has no error', () => {
      const formStateWithValidField: CurrentFormState = {
        [PasswordFields.current]: { value: 'validPassword', error: '' },
        [PasswordFields.new]: { value: '', error: '' },
        [PasswordFields.confirm]: { value: '', error: '' },
      };
      render(<PasswordInputGroup {...defaultProps} formState={formStateWithValidField} />);

      const currentPasswordInput = screen.getAllByLabelText(/current password/i)[0];
      expect(currentPasswordInput).toHaveAttribute('aria-invalid', 'false');
    });

    it('marks field as invalid if it has an error', () => {
      const formStateWithInvalidField: CurrentFormState = {
        [PasswordFields.current]: { value: 'invalidPassword', error: 'Invalid password' },
        [PasswordFields.new]: { value: '', error: '' },
        [PasswordFields.confirm]: { value: '', error: '' },
      };
      render(<PasswordInputGroup {...defaultProps} formState={formStateWithInvalidField} />);

      const currentPasswordInput = screen.getAllByLabelText(/current password/i)[0];
      expect(currentPasswordInput).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('Error message display', () => {
    it('shows validation message when field has an error', async () => {
      const formStateWithError: CurrentFormState = {
        [PasswordFields.current]: { value: '', error: 'The current password is required.' },
        [PasswordFields.new]: { value: '', error: '' },
        [PasswordFields.confirm]: { value: '', error: '' },
      };
      render(<PasswordInputGroup {...defaultProps} formState={formStateWithError} />);

      const currentPasswordInput = screen.getAllByLabelText(/current password/i)[0];

      await act(async () => {
        await userEvent.type(currentPasswordInput, 'dirty');
        await userEvent.clear(currentPasswordInput);
      });

      const errorMessage = screen.getByText('The current password is required.');

      expect(errorMessage).toBeInTheDocument();
    });

    it('does not show validation message when field has no error', () => {
      render(<PasswordInputGroup {...defaultProps} />);

      const errorMessage = screen.queryByText('The current password is required.');
      expect(errorMessage).not.toBeInTheDocument();
    });
  });
});
