/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlatformAdapterProvider, useMockPlatformAdapter } from '../../../../adapters';
import EventSheetControler from '.';
import { render, waitFor } from '@testing-library/react';
import { QueryClientProvider, QueryClient, useQuery } from '@tanstack/react-query';
import { SharedUIConfigProvider } from 'src/providers';
import { MockSharedUiConfig } from 'src/test';
import { convertStringToRichtextModule } from 'src/utils/rich-text-utils';
import { useHydrateAtoms } from 'jotai/utils';
import { Provider } from 'jotai';
import { offerSheetAtom } from '../../store';

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

const mockPlatformAdapter = useMockPlatformAdapter(200, { data: { redemptionType: 'ballot' } });
const mockQueryClient = new QueryClient();

const HydrateAtoms = ({ initialValues, children }: any) => {
  useHydrateAtoms(initialValues);
  return children;
};

const TestProvider = ({ initialValues, children }: any) => (
  <Provider>
    <HydrateAtoms initialValues={initialValues}>{children}</HydrateAtoms>
  </Provider>
);

function renderComponent() {
  return render(
    <TestProvider
      initialValues={[
        [
          offerSheetAtom,
          {
            redemptionType: 'ballot',
            offerMeta: {
              companyId: '',
              companyName: '',
              offerId: '3802',
            },
            eventDetails: {
              id: '3802',
              name: 'Test event',
              description: convertStringToRichtextModule('Test event description.'),
              expires: '2030-06-30T23:59:59.000Z',
              termsAndConditions: convertStringToRichtextModule(
                'Must be a Blue Light Card member in order to receive the discount.',
              ),
              type: 'ticket',
              image: 'companyimages/complarge/retina/',
              startDate: '2030-06-30T23:59:59.000Z',
              endDate: '2030-06-30T23:59:59.000Z',
              venueName: 'Test venue',
              howItWorks: convertStringToRichtextModule('Test how it works.'),
            },
            offerDetails: {},
          },
        ],
      ]}
    >
      <SharedUIConfigProvider value={MockSharedUiConfig}>
        <QueryClientProvider client={mockQueryClient}>
          <PlatformAdapterProvider adapter={mockPlatformAdapter}>
            <EventSheetControler />
          </PlatformAdapterProvider>
        </QueryClientProvider>
      </SharedUIConfigProvider>
    </TestProvider>,
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

  it('should render correct screen for error event status', () => {
    mockedUseQuery.mockReturnValue({
      status: 'error',
    } as ReturnType<typeof useQuery>);
    const { getByRole } = renderComponent();

    expect(
      getByRole('heading', { name: /sorry, we couldn’t load your event at the moment\./i }),
    ).toBeTruthy();
  });

  it('should render correct screen for success event status', async () => {
    mockedUseQuery.mockReturnValue({
      data: {},
      status: 'success',
      isSuccess: true,
    } as ReturnType<typeof useQuery>);
    const { getByRole } = renderComponent();
    await waitFor(() => {
      expect(getByRole('button', { name: /Enter ballot/i })).toBeTruthy();
    });
  });
});
