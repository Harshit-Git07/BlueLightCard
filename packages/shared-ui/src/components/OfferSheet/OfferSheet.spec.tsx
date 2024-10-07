/* eslint-disable @typescript-eslint/no-explicit-any */
import OfferSheet, { Props } from '.';
import { render } from '@testing-library/react';
import { PlatformAdapterProvider, useMockPlatformAdapter } from '../../adapters';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { SharedUIConfigProvider } from 'src/providers';
import { MockSharedUiConfig } from 'src/test';

const mockPlatformAdapter = useMockPlatformAdapter(200, { data: { redemptionType: 'vault' } });
const mockQueryClient = new QueryClient();

const props: Props = {
  height: '90%',
};

// Mock the useQuery hook from @tanstack/react-query
jest.mock('@tanstack/react-query', () => {
  const actualReactQuery = jest.requireActual('@tanstack/react-query');
  return {
    ...actualReactQuery,
    useQuery: jest.fn(),
  };
});

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
      <SharedUIConfigProvider value={MockSharedUiConfig}>
        <PlatformAdapterProvider adapter={mockPlatformAdapter}>
          <OfferSheet {...props} />
        </PlatformAdapterProvider>
      </SharedUIConfigProvider>
    </QueryClientProvider>,
  );
}

describe('smoke test', () => {
  beforeEach(() => {
    // Set up the mock data for useQuery
    (useQuery as jest.Mock).mockReturnValue({
      data: {
        canRedeemOffer: true,
      },
    });
  });

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
    const { getAllByRole } = renderComponent();

    expect(getAllByRole('button', { name: /get discount/i })).toBeTruthy();
  });
});
