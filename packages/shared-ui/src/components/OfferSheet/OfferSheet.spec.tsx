/* eslint-disable @typescript-eslint/no-explicit-any */
import OfferSheet, { Props } from '.';
import { render } from '@testing-library/react';
import { PlatformAdapterProvider, useMockPlatformAdapter } from '../../adapters';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockPlatformAdapter = useMockPlatformAdapter(200, { data: { redemptionType: 'vault' } });
const mockQueryClient = new QueryClient();

const props: Props = {
  height: '90%',
};

jest.mock('../../hooks/useOfferDetails', () => ({
  useOfferDetails: jest.fn().mockReturnValue({
    data: {
      id: 1,
      companyId: 1,
      companyLogo: 'text',
      description: 'text',
      expiry: 'text',
      name: 'text',
      terms: 'text',
      type: 'text',
    },
    status: 'success',
  }),
}));

function renderComponent() {
  return render(
    <QueryClientProvider client={mockQueryClient}>
      <PlatformAdapterProvider adapter={mockPlatformAdapter}>
        <OfferSheet {...props} />
      </PlatformAdapterProvider>
      ,
    </QueryClientProvider>,
  );
}

describe('smoke test', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should render component without error', () => {
    renderComponent();
  });

  it('should render close button', () => {
    const { container } = renderComponent();

    const closeButton = container.querySelector(
      'div > div > div > div:nth-child(2) > div:nth-child(1)',
    );

    expect(closeButton).toBeTruthy();
  });

  it('should render offer details', () => {
    const { getByRole, getByText } = renderComponent();

    expect(getByRole('button', { name: /get discount/i })).toBeTruthy();
  });
});
