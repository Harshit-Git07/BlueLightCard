/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlatformAdapterProvider, useMockPlatformAdapter } from '../../../../adapters';
import OfferSheetControler from '.';
import { render, waitFor } from '@testing-library/react';
import { QueryClientProvider, QueryClient, useQuery } from '@tanstack/react-query';
import { useOfferDetails } from '../../../../hooks/useOfferDetails';
import { SharedUIConfigProvider } from 'src/providers';
import { MockSharedUiConfig } from 'src/test';

jest.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '',
    query: '',
    asPath: '',
    push: jest.fn(),
  }),
}));

// Mock the useQuery hook from @tanstack/react-query
jest.mock('@tanstack/react-query', () => {
  const actualReactQuery = jest.requireActual('@tanstack/react-query');
  return {
    ...actualReactQuery,
    useQuery: jest.fn(),
  };
});

const mockPlatformAdapter = useMockPlatformAdapter(200, { data: { redemptionType: 'vault' } });
const mockQueryClient = new QueryClient();

function renderComponent() {
  return render(
    <SharedUIConfigProvider value={MockSharedUiConfig}>
      <QueryClientProvider client={mockQueryClient}>
        <PlatformAdapterProvider adapter={mockPlatformAdapter}>
          <OfferSheetControler />
        </PlatformAdapterProvider>
      </QueryClientProvider>
    </SharedUIConfigProvider>,
  );
}

jest.mock('../../../../hooks/useOfferDetails');

describe('smoke test', () => {
  beforeEach(() => {
    // Set up the mock data for useQuery
    (useQuery as jest.Mock).mockReturnValue({
      data: {
        canRedeemOffer: true,
      },
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correct screen for pending offer status', () => {
    jest.mocked(useOfferDetails as jest.Mock).mockReturnValue({
      status: 'pending',
    });
    const { container } = renderComponent();
    expect(container.querySelector('div > div > svg > path')).toBeTruthy();
  });

  it('should render correct screen for error offer status', () => {
    jest.mocked(useOfferDetails as jest.Mock).mockReturnValue({
      status: 'error',
    });
    const { getByRole, getByText } = renderComponent();

    expect(
      getByRole('heading', { name: /sorry, we couldn’t load your offer at the moment\./i }),
    ).toBeTruthy();
    expect(getByText(/don’t worry, you can access it by clicking the button below\./i));
    expect(getByRole('button')).toBeTruthy();
  });

  it('should render correct screen for success offer status', async () => {
    jest.mocked(useOfferDetails as jest.Mock).mockReturnValue({
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
    });
    const { getByRole } = renderComponent();
    await waitFor(() => {
      expect(getByRole('button', { name: /get discount/i })).toBeTruthy();
    });
  });
});
