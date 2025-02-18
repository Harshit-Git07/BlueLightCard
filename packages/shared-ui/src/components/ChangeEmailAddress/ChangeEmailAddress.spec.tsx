import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChangeEmailAddress from './';
import { PlatformAdapterProvider, useMockPlatformAdapter } from '../../adapters';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import changeEmailAddressText from './ChangeEmailAddressText';
import { V5_API_URL } from '@/constants';

const memberUuid = 'abcd-1234';
jest.mock('../../hooks/useMemberId', () => ({
  __esModule: true,
  default: () => memberUuid,
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const testHarness = (status = 200, data = {}) => {
  const email = 'example@blc.co.uk';

  const mockPlatformAdapter = useMockPlatformAdapter(status, data);
  render(
    <PlatformAdapterProvider adapter={mockPlatformAdapter}>
      <QueryClientProvider client={createTestQueryClient()}>
        <ChangeEmailAddress email={email} />
      </QueryClientProvider>
    </PlatformAdapterProvider>,
  );
  const currentEmail = screen.getAllByLabelText(changeEmailAddressText.currentEmail.label, {})[0];
  const newEmail = screen.getAllByLabelText(changeEmailAddressText.newEmail.label, {})[0];
  const confirmEmail = screen.getAllByLabelText(changeEmailAddressText.confirmEmail.label, {})[0];
  const saveButton = screen.getByText('Save', { exact: true });
  const cancelButton = screen.getByText('Cancel', { exact: true });
  return {
    mockPlatformAdapter,
    currentEmail,
    newEmail,
    confirmEmail,
    saveButton,
    cancelButton,
  };
};

describe('ChangeEmailAddress component', () => {
  it('should render initial state', () => {
    const { currentEmail, newEmail, confirmEmail, saveButton, cancelButton } = testHarness();
    const txt = screen.getByText('Change email', {});
    expect(txt).toBeInTheDocument();
    expect(currentEmail).toHaveValue('example@blc.co.uk');
    expect(newEmail).toHaveValue('');
    expect(confirmEmail).toHaveValue('');
    expect(saveButton).toBeDisabled();
    expect(cancelButton).toBeEnabled();
  });

  describe('happy path', () => {
    it('should call the api endpoint', async () => {
      const { mockPlatformAdapter, newEmail, confirmEmail, saveButton } = testHarness();

      // type a new email address
      await act(async () => {
        await userEvent.type(newEmail, 'foo@bar.com');
      });

      // type the same email in the confirm
      await act(async () => {
        await userEvent.type(confirmEmail, 'foo@bar.com');
      });

      // save button should now be clickable
      expect(saveButton).toBeEnabled();

      // click the save button
      await act(async () => {
        await userEvent.click(saveButton);
      });

      // calls the API
      await waitFor(async () => {
        expect(mockPlatformAdapter.invokeV5Api).toHaveBeenCalledWith(
          `${V5_API_URL.Profile('abcd-1234')}/email`,
          {
            method: 'PUT',
            body: JSON.stringify({
              currentEmail: 'example@blc.co.uk',
              newEmail: 'foo@bar.com',
            }),
          },
        );
      });

      // should be on the verification screen
      const verification = screen.getByText(changeEmailAddressText.verificationTitle);
      expect(verification).toBeInTheDocument();
    });
  });

  describe('sad paths', () => {
    it('should show error if new email is invalid', async () => {
      const { newEmail, saveButton } = testHarness();

      // type a new email address
      await act(async () => {
        await userEvent.type(newEmail, 'notavalidemailaddress');
      });

      // it should show that the email is invalid
      await waitFor(() => {
        const errorMessage = screen.queryByText(changeEmailAddressText.invalidEmail);
        expect(errorMessage).toBeInTheDocument();
      });

      // blocked
      expect(saveButton).toBeDisabled();
    });

    it('should show error if emails are not the same', async () => {
      const { newEmail, confirmEmail, saveButton } = testHarness();

      // type a new email address
      await act(async () => {
        await userEvent.type(newEmail, 'example@blc.co.uk');
        await userEvent.type(confirmEmail, 'foo@blc.co.uk');
      });

      // it should show that the confirm email does not match
      await waitFor(() => {
        const errorMessage = screen.queryByText(changeEmailAddressText.emailsMustMatch);
        expect(errorMessage).toBeInTheDocument();
      });

      // blocked
      expect(saveButton).toBeDisabled();
    });

    it('should show an error from API', async () => {
      const { mockPlatformAdapter, newEmail, confirmEmail, saveButton } = testHarness(500, {
        error: 'foobar happened',
      });

      // type a new email address
      await act(async () => {
        await userEvent.type(newEmail, 'foo@bar.com');
        await userEvent.type(confirmEmail, 'foo@bar.com');
      });

      // save button should now be clickable
      expect(saveButton).toBeEnabled();

      // click the save button
      await act(async () => {
        await userEvent.click(saveButton);
      });

      // calls the API
      await waitFor(() => {
        expect(mockPlatformAdapter.invokeV5Api).toHaveBeenCalled();
      });

      // it should show the api error message
      await waitFor(() => {
        const errorMessage = screen.queryByText('foobar happened', {});
        expect(errorMessage).toBeInTheDocument();
      });
    });

    it('should show an unknown error when API goes wrong', async () => {
      const { mockPlatformAdapter, newEmail, confirmEmail, saveButton } = testHarness(400);

      // type a new email address
      await act(async () => {
        await userEvent.type(newEmail, 'foo@bar.com');
        await userEvent.type(confirmEmail, 'foo@bar.com');
      });

      // save button should now be clickable
      expect(saveButton).toBeEnabled();

      // click the save button
      await act(async () => {
        await userEvent.click(saveButton);
      });

      // calls the API
      await waitFor(() => {
        expect(mockPlatformAdapter.invokeV5Api).toHaveBeenCalled();
      });

      // it should show unknown error
      await waitFor(() => {
        const errorMessage = screen.queryByText(changeEmailAddressText.unknownError);
        expect(errorMessage).toBeInTheDocument();
      });

      // change response to OK
      mockPlatformAdapter.invokeV5Api.mockResolvedValue({
        status: 500,
        data: JSON.stringify({
          error: 'foobar happened',
        }),
      });

      // click the save button AGAIN
      await act(async () => {
        await userEvent.click(saveButton);
      });

      // calls the API
      await waitFor(() => {
        expect(mockPlatformAdapter.invokeV5Api).toHaveBeenCalledTimes(2);
      });

      // it should show the api error message - NOT the generic one
      await waitFor(() => {
        const errorMessage = screen.queryByText('foobar happened', {});
        expect(errorMessage).toBeInTheDocument();
      });
    });
  });
});
