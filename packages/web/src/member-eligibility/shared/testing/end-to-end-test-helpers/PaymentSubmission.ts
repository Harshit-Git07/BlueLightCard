import { act, fireEvent, screen } from '@testing-library/react';

export async function givenPaymentIsSubmitted(): Promise<void> {
  const nextButton = screen.getByTestId('payment-form-submit-button');
  await act(async () => {
    fireEvent.click(nextButton);
  });
}
