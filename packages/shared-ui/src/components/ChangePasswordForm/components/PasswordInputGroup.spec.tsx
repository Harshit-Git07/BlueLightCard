import { PasswordInputGroup, PasswordInputGroupProps } from './PasswordInputGroup';
import { initialFormState } from '../useChangePasswordState';
import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@storybook/testing-library';

const mockUpdateValue = jest.fn();
const mockBlur = jest.fn();
describe('PasswordInputGroup', () => {
  const defaultProps: PasswordInputGroupProps = {
    formState: initialFormState,
    updatePasswordValue: mockUpdateValue,
    onBlur: mockBlur,
  };

  it('matches snapshot in default state', () => {
    const { container } = render(<PasswordInputGroup {...defaultProps} />);

    expect(container).toMatchSnapshot();
  });

  it('matches snapshot in populated state', () => {
    const { container } = render(
      <PasswordInputGroup
        {...defaultProps}
        formState={{
          currentPassword: { value: 'testCurrentPassword' },
          newPassword: { value: 'testNewPassword' },
          newPasswordConfirm: { value: 'testNewPasswordConfirm' },
        }}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('triggers callback with correct params when inputting values into correct elements', async () => {
    render(<PasswordInputGroup {...defaultProps} />);

    const currentPasswordInputField = screen.getAllByLabelText('Current password')[1];
    await act(async () => {
      await userEvent.type(currentPasswordInputField, 'testCurrentPassword');
    });
    expect(mockUpdateValue).toHaveBeenLastCalledWith('testCurrentPassword', 'currentPassword');

    const newPasswordInputField = screen.getAllByLabelText('New password')[1];
    await act(async () => {
      await userEvent.type(newPasswordInputField, 'testNewPassword');
    });
    expect(mockUpdateValue).toHaveBeenLastCalledWith('testNewPassword', 'newPassword');

    const newPasswordConfirmInputField = screen.getAllByLabelText('Confirm new password')[1];
    await act(async () => {
      await userEvent.type(newPasswordConfirmInputField, 'testNewPasswordConfirm');
    });
    expect(mockUpdateValue).toHaveBeenLastCalledWith(
      'testNewPasswordConfirm',
      'newPasswordConfirm',
    );
  });

  it('triggers blur callback with correct params when blurring field', async () => {
    render(<PasswordInputGroup {...defaultProps} />);

    const currentPasswordInputField = screen.getAllByLabelText('Current password')[1];
    await act(async () => {
      await userEvent.type(currentPasswordInputField, ' ');
      await userEvent.tab();
    });
    expect(mockBlur).toHaveBeenLastCalledWith('currentPassword');

    const newPasswordInputField = screen.getAllByLabelText('New password')[1];
    await act(async () => {
      await userEvent.type(newPasswordInputField, ' ');
      await userEvent.tab();
    });
    expect(mockBlur).toHaveBeenLastCalledWith('newPassword');

    const newPasswordConfirmInputField = screen.getAllByLabelText('Confirm new password')[1];
    await act(async () => {
      await userEvent.type(newPasswordConfirmInputField, ' ');
      await userEvent.tab();
    });
    expect(mockBlur).toHaveBeenLastCalledWith('newPasswordConfirm');
  });
});
