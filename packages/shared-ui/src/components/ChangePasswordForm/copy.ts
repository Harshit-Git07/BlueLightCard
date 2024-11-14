const changePasswordFormCopy = {
  title: 'Change Password',
  primaryButtonLabel: 'Save',
  secondaryButtonLabel: 'Cancel',
  currentPasswordInput: {
    label: 'Current password',
    placeholder: 'Add current password',
  },
  newPasswordInput: {
    label: 'New password',
    placeholder: 'Add new password',
  },
  newPasswordConfirmInput: {
    label: 'Confirm new password',
    placeholder: 'Confirm new password',
  },
  validation: {
    missingCurrent: 'The current password is required.',
    incorrectCurrentPassword:
      'The password entered doesn’t match with this account. Please try again.',
    invalidPasswordRequirements: 'The password entered is invalid. Please try again.',
    notNew: 'The new password needs to be different from current password.',
    doesNotMatch: 'The passwords entered do not match. Please try again.',
  },
};

export default changePasswordFormCopy;
