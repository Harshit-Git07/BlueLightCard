import { PlatformAdapterProvider, useMockPlatformAdapter } from '../../adapters';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CopyButton from './CopyButton';

describe('CopyButton Page', () => {
  const mockPlatformAdapter = useMockPlatformAdapter();

  const accountNumber = 'BLC0000000';

  test('should render correctly', async () => {
    render(
      <PlatformAdapterProvider adapter={mockPlatformAdapter}>
        <CopyButton copyText={accountNumber} />
      </PlatformAdapterProvider>,
    );

    const button = await screen.findByRole('button', { name: 'copy' });
    expect(button).toBeInTheDocument();
  });

  test('should copy the account number to clipboard', async () => {
    render(
      <PlatformAdapterProvider adapter={mockPlatformAdapter}>
        <CopyButton copyText={accountNumber} />
      </PlatformAdapterProvider>,
    );

    const btn = screen.getByRole('button');
    expect(btn).toBeInTheDocument();

    await userEvent.click(btn);

    expect(mockPlatformAdapter.writeTextToClipboard).toHaveBeenCalledWith(accountNumber);
  });
});
