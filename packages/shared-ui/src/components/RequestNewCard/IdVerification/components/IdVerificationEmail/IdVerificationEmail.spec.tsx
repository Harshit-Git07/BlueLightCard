import '@testing-library/jest-dom';
import { act } from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// import { testRender } from '../../IdVerification.spec';

const email = 'foobar@blc.co.uk';
// const memberId = 'abcd-1234';
describe('IdVerificationEmail component', () => {
  it.skip('handle email verification', async () => {
    // const { mockPlatformAdapter } = await testRender({ memberId, verificationMethod });

    const submit = screen.getByRole('button', { name: 'Verify email' });
    expect(submit).toBeDisabled();

    const field = screen.getByLabelText('Enter work email address');
    expect(field).toBeInTheDocument();

    await act(async () => {
      await userEvent.type(field, email.substring(0, 6));
    });

    await waitFor(() => {
      expect(screen.getByLabelText('Invalid email')).toBeInTheDocument();
    });

    await act(async () => {
      await userEvent.type(field, email.substring(6));
    });

    await waitFor(() => expect(submit).toBeEnabled());

    await act(async () => {
      await userEvent.click(submit);
    });

    // await waitFor(() => {
    //   expect(mockPlatformAdapter.invokeV5Api).toHaveBeenCalledWith('/api/v1/email/verify', {
    //     method: 'PUT',
    //     body: JSON.stringify({ email, memberId }),
    //   });
    // });

    await waitFor(() => expect(submit).toBeDisabled());

    await waitFor(() => expect(submit).toHaveTextContent('Resend email in 30s'));
    await waitFor(() => expect(submit).toHaveTextContent('Resend email in 29s'));
  });
});
