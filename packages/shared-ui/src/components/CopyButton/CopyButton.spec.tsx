import { PlatformAdapterProvider, useMockPlatformAdapter } from '../../adapters';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CopyButton from './CopyButton';
import { ThemeVariant } from '../../types';

describe('CopyButton Page', () => {
  const mockPlatformAdapter = useMockPlatformAdapter();

  const accountNumber = 'BLC0000000';

  test('should render correctly', async () => {
    render(
      <PlatformAdapterProvider adapter={mockPlatformAdapter}>
        <CopyButton variant={ThemeVariant.Primary} size="Small" copyText={accountNumber} />
      </PlatformAdapterProvider>,
    );

    const button = await screen.findByRole('button', { name: 'copy' });
    expect(button).toBeInTheDocument();
  });

  test('should copy the account number to clipboard', async () => {
    render(
      <PlatformAdapterProvider adapter={mockPlatformAdapter}>
        <CopyButton variant={ThemeVariant.Primary} size="Small" copyText={accountNumber} />
      </PlatformAdapterProvider>,
    );

    const btn = screen.getByRole('button');
    expect(btn).toBeInTheDocument();

    await userEvent.click(btn);

    expect(mockPlatformAdapter.writeTextToClipboard).toHaveBeenCalledWith(accountNumber);

    expect(screen.getByText('Copied to clipboard')).toBeInTheDocument();

    let button = screen.queryByRole('button', { name: 'copy' });
    expect(button).not.toBeInTheDocument();

    await waitForElementToBeRemoved(() => screen.queryByText('Copied to clipboard'), {
      timeout: 3000,
    });

    button = screen.queryByRole('button', { name: 'copy' });
    expect(button).toBeInTheDocument();
  });
});
