import { PlatformAdapterProvider, useMockPlatformAdapter } from '../../adapters';
import { render, screen } from '@testing-library/react';
import AccountDetails from './index';

describe('AccountDetails', () => {
  const firstName = 'Name';
  const lastName = 'Last-name';
  const accountNumber = 'BLC12345678';
  const mockPlatformAdapter = useMockPlatformAdapter();

  it('should render AccountDetails correctly', async () => {
    render(
      <PlatformAdapterProvider adapter={mockPlatformAdapter}>
        <AccountDetails accountNumber={accountNumber} firstName={firstName} lastName={lastName} />
      </PlatformAdapterProvider>,
    );

    const names = await screen.findAllByText(`Hi ${firstName} ${lastName},`);
    expect(names.length).toStrictEqual(2);

    const accNo = await screen.findByText(accountNumber);
    expect(accNo).toBeInTheDocument();

    const button = await screen.findByRole('button', { name: 'copy' });
    expect(button).toBeInTheDocument();
  });

  it('should hide the account number and copy button when account number not provided', async () => {
    render(
      <PlatformAdapterProvider adapter={mockPlatformAdapter}>
        <AccountDetails firstName={firstName} lastName={lastName} />
      </PlatformAdapterProvider>,
    );

    const names = await screen.findAllByText(`Hi ${firstName} ${lastName},`);
    expect(names.length).toStrictEqual(2);

    const accNo = screen.queryByText(accountNumber);
    expect(accNo).not.toBeInTheDocument();

    const defaultAccNo = screen.queryByText('BLC0000000');
    expect(defaultAccNo).not.toBeInTheDocument();

    const button = screen.queryByRole('button', { name: 'copy' });
    expect(button).not.toBeInTheDocument();
  });

  it('should have aria label for the user name', async () => {
    render(
      <PlatformAdapterProvider adapter={mockPlatformAdapter}>
        <AccountDetails accountNumber={accountNumber} firstName={firstName} lastName={lastName} />
      </PlatformAdapterProvider>,
    );

    const name = `Hi ${firstName} ${lastName},`;
    const nameElt = (await screen.findAllByText(name))[0];
    expect(nameElt).toBeInTheDocument();
    expect(nameElt).toHaveAttribute('aria-label', name);
  });
});
