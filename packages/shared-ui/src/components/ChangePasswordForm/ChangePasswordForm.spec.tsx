import ChangePasswordForm, { Props } from '.';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { PlatformAdapterProvider, useMockPlatformAdapter } from '../../adapters';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import copy from './copy';
import { userEvent } from '@storybook/testing-library';
import { act } from 'react';
import { V5_API_URL } from '@/constants';

const mockClose = jest.fn();
jest.mock('../Drawer/useDrawer', () => () => ({
  close: mockClose,
}));

const mockPasswordUpdateSuccess = jest.fn();
const defaultProps: Props = {
  memberId: 'testMemberId',
  onPasswordUpdateSuccess: () => mockPasswordUpdateSuccess(),
};

const validPassword = 'aA2@aiaiai';

const testHarness = (status = 200, data = {}) => {
  const adapter = useMockPlatformAdapter(status, data);

  const { container } = render(
    <PlatformAdapterProvider adapter={adapter}>
      <QueryClientProvider client={new QueryClient()}>
        <ChangePasswordForm {...defaultProps} />
      </QueryClientProvider>
    </PlatformAdapterProvider>,
  );

  const saveButton = screen.getByRole('button', { name: copy.primaryButtonLabel });
  const cancelButton = screen.getByRole('button', { name: copy.secondaryButtonLabel });

  const getInputFieldForLabel = (label: HTMLElement) =>
    (label.closest('div') as HTMLElement).children[0];

  const currentPasswordInputField = screen.getAllByLabelText(copy.currentPasswordInput.label)[0];
  const clearCurrentPassword = async () =>
    await act(async () => await userEvent.clear(getInputFieldForLabel(currentPasswordInputField)));
  const enterIntoCurrentPassword = async (text: string) =>
    await act(async () => {
      await clearCurrentPassword();
      await userEvent.type(currentPasswordInputField, text);
    });

  const newPasswordInputField = screen.getAllByLabelText(copy.newPasswordInput.label)[0];
  const enterIntoNewPassword = async (text: string) =>
    await act(async () => {
      await userEvent.clear(getInputFieldForLabel(newPasswordInputField));
      await userEvent.type(newPasswordInputField, text);
    });

  const newPasswordConfirmInputField = screen.getAllByLabelText(
    copy.newPasswordConfirmInput.label,
  )[0];
  const enterIntoNewPasswordConfirm = async (text: string) =>
    await act(async () => {
      await userEvent.clear(getInputFieldForLabel(newPasswordConfirmInputField));
      await userEvent.type(newPasswordConfirmInputField, text);
    });

  return {
    container,
    adapter,
    saveButton,
    cancelButton,
    currentPasswordInputField,
    clearCurrentPassword,
    enterIntoCurrentPassword,
    newPasswordInputField,
    enterIntoNewPassword,
    newPasswordConfirmInputField,
    enterIntoNewPasswordConfirm,
  };
};

const submittableHarness = async (...args: Parameters<typeof testHarness>) => {
  const harness = testHarness(...args);

  await harness.enterIntoCurrentPassword('currentPassword');
  await harness.enterIntoNewPassword(validPassword);
  await harness.enterIntoNewPasswordConfirm(validPassword);

  return harness;
};

describe('Save button & Validation', () => {
  it('is disabled by default', () => {
    const { saveButton } = testHarness();

    expect(saveButton).toBeDisabled();
  });

  it('is enabled when valid data is entered', async () => {
    const { saveButton } = await submittableHarness();

    expect(saveButton).toBeEnabled();
  });

  it('is disabled if empty current password', async () => {
    const { saveButton, clearCurrentPassword } = await submittableHarness();

    await clearCurrentPassword();

    expect(saveButton).toBeDisabled();

    await act(async () => await userEvent.tab());

    expect(screen.getByText(copy.validation.missingCurrent)).toBeInTheDocument();
  });

  it('is disabled if duplicated current / new password', async () => {
    const {
      saveButton,
      enterIntoCurrentPassword,
      enterIntoNewPassword,
      enterIntoNewPasswordConfirm,
    } = testHarness();

    await enterIntoCurrentPassword(validPassword);
    await enterIntoNewPassword(validPassword);
    await enterIntoNewPasswordConfirm(validPassword);

    expect(saveButton).toBeDisabled();

    expect(screen.getByText(copy.validation.notNew)).toBeInTheDocument();
  });

  it('is disabled after valid new password changes', async () => {
    const { saveButton, enterIntoNewPassword } = await submittableHarness();

    await enterIntoNewPassword('invalidPassword');

    expect(saveButton).toBeDisabled();

    await act(async () => await userEvent.tab());

    expect(screen.getByText(copy.validation.invalidPasswordRequirements)).toBeInTheDocument();
  });

  it('is disabled after mismatch new password confirm', async () => {
    const { saveButton, enterIntoNewPasswordConfirm } = await submittableHarness();

    await enterIntoNewPasswordConfirm('differentPassword');

    expect(saveButton).toBeDisabled();

    await act(async () => await userEvent.tab());

    expect(screen.getByText(copy.validation.doesNotMatch)).toBeInTheDocument();
  });

  describe('ChangePasswordForm', () => {
    describe('Cancel button', () => {
      it('triggers drawer close', async () => {
        const { cancelButton } = testHarness();

        await act(async () => await userEvent.click(cancelButton));

        expect(mockClose).toHaveBeenCalled();
      });
    });

    describe('Submission', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('triggers callbacks onclick if submit request successful', async () => {
        const { saveButton, adapter } = await submittableHarness();

        await act(async () => await userEvent.click(saveButton));

        expect(mockPasswordUpdateSuccess).toHaveBeenCalled();
        expect(mockClose).toHaveBeenCalled();
        expect(adapter.invokeV5Api).toHaveBeenCalledWith(
          `${V5_API_URL.Profile(defaultProps.memberId)}/password`,
          {
            body: JSON.stringify({
              currentPassword: 'currentPassword',
              newPassword: validPassword,
            }),
            method: 'PUT',
          },
        );
      });

      it('displays duplicate error if api returns 401', async () => {
        const { saveButton, adapter } = await submittableHarness(401, {
          errors: [{ code: '401' }],
        });

        await act(async () => await userEvent.click(saveButton));

        expect(mockPasswordUpdateSuccess).not.toHaveBeenCalled();
        expect(screen.getByText(copy.validation.incorrectCurrentPassword)).toBeInTheDocument();
        expect(adapter.invokeV5Api).toHaveBeenCalled();
      });

      it('displays api error for other error code', async () => {
        const { saveButton, adapter } = await submittableHarness(400, {
          errors: [{ code: '400', detail: 'testError' }],
        });

        await act(async () => await userEvent.click(saveButton));

        expect(mockPasswordUpdateSuccess).not.toHaveBeenCalled();
        expect(screen.getByText('testError')).toBeInTheDocument();
        expect(adapter.invokeV5Api).toHaveBeenCalled();
      });
    });
  });
});
