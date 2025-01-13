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
    incorrectCurrentPassword: 'Please enter a valid current password.',
    invalidPasswordRequirements: 'Please enter a valid password.',
    notNew: 'The new password needs to be different from current password.',
    doesNotMatch: 'Please enter a matching password.',
  },
};

export default changePasswordFormCopy;
