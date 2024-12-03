/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlatformAdapterProvider, useMockPlatformAdapter } from '../../../../adapters';
import OfferSheetController from '.';
import { render, waitFor } from '@testing-library/react';
import { QueryClientProvider, QueryClient, useQuery } from '@tanstack/react-query';
import { SharedUIConfigProvider } from 'src/providers';
import { MockSharedUiConfig } from 'src/test';
import { convertStringToRichtextModule } from 'src/utils/rich-text-utils';

jest.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '',
    query: '',
    asPath: '',
    push: jest.fn(),
  }),
}));

const mockedUseQuery = jest.mocked(useQuery);
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
          <OfferSheetController />
        </PlatformAdapterProvider>
      </QueryClientProvider>
    </SharedUIConfigProvider>,
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correct screen for pending offer status', () => {
    mockedUseQuery.mockReturnValue({
      status: 'pending',
    } as ReturnType<typeof useQuery>);
    const { container } = renderComponent();
    expect(container.querySelector('div > div > svg > path')).toBeTruthy();
  });

  it('should render correct screen for error offer status', () => {
    mockedUseQuery.mockReturnValue({
      status: 'error',
    } as ReturnType<typeof useQuery>);
    const { getByRole, getByText } = renderComponent();

    expect(
      getByRole('heading', { name: /sorry, we couldn’t load your offer at the moment\./i }),
    ).toBeTruthy();
    expect(getByText(/don’t worry, you can access it by clicking the button below\./i));
    expect(getByRole('button')).toBeTruthy();
  });

  it('should render correct screen for success offer status', async () => {
    mockedUseQuery.mockReturnValue({
      data: {
        id: '1',
        companyId: '1',
        description: convertStringToRichtextModule('text'),
        expires: 'text',
        name: 'text',
        termsAndConditions: convertStringToRichtextModule('text'),
        type: 'text',
        image: 'text',
      },
      status: 'success',
    } as ReturnType<typeof useQuery>);
    const { getByRole } = renderComponent();
    await waitFor(() => {
      expect(getByRole('button', { name: /get discount/i })).toBeTruthy();
    });
  });
});
