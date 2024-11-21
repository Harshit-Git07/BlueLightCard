import '@testing-library/jest-dom';
import { createStore, Provider } from 'jotai';
import { act } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import IdVerificationIndex from './index';
import { idVerificationAtom } from './idVerificationAtom';
import userEvent from '@testing-library/user-event';
import { PlatformAdapterProvider, useMockPlatformAdapter } from '../../adapters';
import { createQueryClient } from '../../utils/storyUtils';
import { QueryClientProvider } from '@tanstack/react-query';
import { IdVerificationMethod } from './IdVerificationTypes';

const store = createStore();

interface testRenderProps {
  status?: number;
  data?: string;
  memberUuid?: string;
  isDoubleId?: boolean;
  selectedMethod?: null | IdVerificationMethod;
}

export const testRender = async ({
  status = 200,
  data = '',
  memberUuid = '',
  isDoubleId = false,
  selectedMethod = null,
}: testRenderProps) => {
  const mockPlatformAdapter = useMockPlatformAdapter(status, data);

  render(
    <PlatformAdapterProvider adapter={mockPlatformAdapter}>
      <QueryClientProvider client={createQueryClient()}>
        <Provider store={store}>
          <IdVerificationIndex memberUuid={memberUuid ?? ''} isDoubleId={isDoubleId} />
        </Provider>
      </QueryClientProvider>
    </PlatformAdapterProvider>,
  );
  await act(() => store.set(idVerificationAtom, (previous) => ({ ...previous, selectedMethod })));
  return { mockPlatformAdapter, store };
};

describe('IdVerification component', () => {
  it('should render the method selection screen', async () => {
    await testRender({ memberUuid: 'abcd-1234' });
    const verification = store.get(idVerificationAtom);
    expect(verification).toHaveProperty('memberUuid', 'abcd-1234');
    expect(verification).toHaveProperty('isDoubleId', false);

    expect(screen.getByText('Choose verification method')).toBeInTheDocument();
  });

  it('should render the email verification screen', async () => {
    await testRender({});

    const btn = screen.getByLabelText('Button for Work Email');
    await act(() => userEvent.click(btn));

    const nxt = screen.getByRole('button', { name: 'Next' });
    await act(() => userEvent.click(nxt));

    await waitFor(() => {
      const emailField = screen.getByLabelText('Enter work email address');
      expect(emailField).toBeInTheDocument();
    });
  });

  it('should render the file upload verification screen', async () => {
    await testRender({});

    const btn = screen.getByLabelText('Button for Payslip');
    await act(() => userEvent.click(btn));

    const nxt = screen.getByRole('button', { name: 'Next' });
    await act(() => userEvent.click(nxt));

    await waitFor(() => {
      const emailField = screen.getByLabelText('Choose file');
      expect(emailField).toBeInTheDocument();
    });
  });
});
