/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlatformAdapterProvider, useMockPlatformAdapter } from '../../../../adapters';
import OfferSheetControler from '.';
import { render, waitFor } from '@testing-library/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useOfferDetails } from '../../../../hooks/useOfferDetails';

jest.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '',
    query: '',
    asPath: '',
    push: jest.fn(),
  }),
}));

const mockPlatformAdapter = useMockPlatformAdapter(200, { data: { redemptionType: 'vault' } });
const mockQueryClient = new QueryClient();

function renderComponent() {
  return render(
    <QueryClientProvider client={mockQueryClient}>
      <PlatformAdapterProvider adapter={mockPlatformAdapter}>
        <OfferSheetControler />
      </PlatformAdapterProvider>
      ,
    </QueryClientProvider>,
  );
}

jest.mock('../../../../hooks/useOfferDetails');

describe('smoke test', () => {
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

    expect(getByRole('heading', { name: /error loading offer/i })).toBeTruthy();
    expect(getByText(/you can still get to your offer by clicking the button below\./i));
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
