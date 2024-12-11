export const copy = {
  awaitingId: {
    title: 'Get your {brandTitle}',
    subtext: 'Access exclusive offers for the next {cardDuration} for £4.99',
    buttonText: {
      awaitingId: 'Get your card',
      awaitingPayment: 'Make payment',
    },
  },
  awaitingIdApproval: {
    title: 'Your eligibility is being verified',
    subtext: 'You will receive a confirmation email, and your virtual card will be ready shortly',
    buttonText: 'Need help?',
  },
  rejected: {
    title: 'Your eligibility proof has been declined',
    subtext: {
      BLURRY_IMAGE_DECLINE_ID:
        'Your image is not clear enough. Provide a valid proof of eligibility.',
      DATE_DECLINE_ID: 'Your payslip is older than 3 months. Provide a valid proof of eligibility.',
      DECLINE_INCORRECT_ID: 'Your uploaded ID is invalid. Provide a valid proof of eligibility.',
      DIFFERENT_NAME_DECLINE_ID:
        'The name on your ID does not match your account. Provide a valid proof of eligibility.',
      DECLINE_NOT_ELIGIBLE:
        'Your proof of employment is invalid. Check your email resolve the issue.',
      DL_PP_DECLINE_ID:
        'You uploaded a driving license or passport. Provide a valid proof of eligibility.',
      PASSWORD_PROTECTED_DECLINE_ID:
        'Your ID is password-protected. Provide an accessible proof of eligibility.',
      PICTURE_DECLINE_ID: 'You uploaded a photo of yourself. Provide a valid proof of eligibility.',
    },
    buttonText: 'Verify your eligibility',
  },
} as const;
