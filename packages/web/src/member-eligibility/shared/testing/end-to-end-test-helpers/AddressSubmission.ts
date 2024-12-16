import { act, fireEvent, screen, within } from '@testing-library/react';

export async function givenAddressIsSubmitted(): Promise<void> {
  await act(async () => {
    fireEvent.change(screen.getByLabelText('Address line 1'), {
      target: { value: '123 Test Street' },
    });
    fireEvent.change(screen.getByLabelText('Town/City'), {
      target: { value: 'Test City' },
    });
    fireEvent.change(within(screen.getByTestId('county-dropdown')).getByTestId('combobox'), {
      target: { value: 'Down' },
    });
    fireEvent.change(screen.getByLabelText('Postcode'), {
      target: { value: 'TE12 3ST' },
    });

    fireEvent.click(screen.getByTestId('next-button'));
  });
}
