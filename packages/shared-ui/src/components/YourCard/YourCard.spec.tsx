import { PlatformAdapterProvider, useMockPlatformAdapter } from '../../adapters';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import YourCard from './index';

describe('YourCard', () => {
  const mockPlatformAdapter = useMockPlatformAdapter();

  const brand = 'blc-uk';
  const firstName = 'Name';
  const lastName = 'Last-name';
  const accountNumber = 'BLC12345678';
  const cardExpiry = '2024-12-12T00:00:00Z';

  test('should render generated card correctly', async () => {
    render(
      <PlatformAdapterProvider adapter={mockPlatformAdapter}>
        <YourCard
          brand={brand}
          firstName={firstName}
          lastName={lastName}
          accountNumber={accountNumber}
          expiryDate={cardExpiry}
        />
      </PlatformAdapterProvider>,
    );

    const name = await screen.findByText(`${firstName} ${lastName}`);
    expect(name).toBeInTheDocument();

    const accNo = await screen.findByText(accountNumber);
    expect(accNo).toBeInTheDocument();

    const date = await screen.findByText('12/12/2024');
    expect(date).toBeInTheDocument();

    const button = await screen.findByRole('button', { name: 'copy' });
    expect(button).toBeInTheDocument();
  });

  test('should render NOT generated card correctly', async () => {
    const { container } = render(
      <PlatformAdapterProvider adapter={mockPlatformAdapter}>
        <YourCard brand={brand} firstName={firstName} lastName={lastName} />
      </PlatformAdapterProvider>,
    );

    const name = await screen.findByText(`${firstName} ${lastName}`);
    expect(name).toBeInTheDocument();

    const accNo = screen.queryByText(accountNumber);
    expect(accNo).not.toBeInTheDocument();

    const defaultAccNo = screen.getByText('BLC0000000');
    expect(defaultAccNo).toBeInTheDocument();

    const expDate = screen.queryByText('12/12/2024');
    expect(expDate).not.toBeInTheDocument();

    const defaultExpDate = screen.getByText('01/01/2030');
    expect(defaultExpDate).toBeInTheDocument();

    const containerDiv = container.firstChild?.firstChild?.firstChild as HTMLDivElement;
    expect(containerDiv.classList.contains('blur-[4px]')).toBe(true);
  });
});
