/* eslint-disable @typescript-eslint/no-explicit-any */
import OfferSheetDetailsPage from './';
import { render } from '@testing-library/react';
import { useHydrateAtoms } from 'jotai/utils';
import { Provider } from 'jotai';
import { OfferSheetAtom, offerSheetAtom } from '../../store';
import { PlatformAdapterProvider, useMockPlatformAdapter } from 'src/adapters';
import { SharedUIConfigProvider } from 'src/providers';
import { MockSharedUiConfig } from 'src/test';
import { RedemptionType } from '../../types';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { convertStringToRichtextModule } from 'src/utils/rich-text-utils';
import { createFactoryMethod } from 'src/utils/createFactoryMethod';

jest.mock('@tanstack/react-query', () => {
  const actualReactQuery = jest.requireActual('@tanstack/react-query');
  return {
    ...actualReactQuery,
    useQuery: jest.fn(),
  };
});

const queryClient = new QueryClient();

const createOfferDetails = createFactoryMethod({
  companyId: '4016',
  image: 'companyimages/complarge/retina/',
  description: convertStringToRichtextModule(
    'SEAT have put together a discount on the price of a new car.  Visit the link to see some example pricing and your enquiry will be passed to a SEAT approved agent.',
  ),
  expires: '2030-06-30T23:59:59.000Z',
  id: '3802',
  name: 'Save with SEAT',
  termsAndConditions: convertStringToRichtextModule(
    'Must be a Blue Light Card member in order to receive the discount.',
  ),
  type: 'online',
} as const);

const createOfferSheetAtom = createFactoryMethod<OfferSheetAtom>({
  offerDetails: createOfferDetails(),
  offerMeta: {
    companyId: 4016,
    companyName: 'SEAT',
    offerId: 3802,
  },
  redemptionType: 'vault',
} as OfferSheetAtom);

const mockPlatformAdapter = useMockPlatformAdapter(200, {
  data: {
    redemptionType: 'vault',
    redemptionDetails: {
      url: 'https://www.google.com',
      code: '123456',
    },
  },
});

const HydrateAtoms = ({
  initialValues,
  children,
}: {
  initialValues: any;
  children: React.ReactNode;
}) => {
  useHydrateAtoms(initialValues);
  return children;
};

const TestProvider = ({
  initialValues,
  children,
}: {
  initialValues: any;
  children: React.ReactNode;
}) => (
  <Provider>
    <HydrateAtoms initialValues={initialValues}>{children}</HydrateAtoms>
  </Provider>
);

const OfferSheetDetailsPageProvider = ({
  offerSheetAtomData,
}: {
  offerSheetAtomData: OfferSheetAtom;
}) => {
  return (
    <TestProvider initialValues={[[offerSheetAtom, offerSheetAtomData]]}>
      <OfferSheetDetailsPage />
    </TestProvider>
  );
};

describe('smoke test', () => {
  beforeEach(() => {
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
    render(
      <QueryClientProvider client={queryClient}>
        <SharedUIConfigProvider value={MockSharedUiConfig}>
          <PlatformAdapterProvider adapter={mockPlatformAdapter}>
            <OfferSheetDetailsPage />
          </PlatformAdapterProvider>
        </SharedUIConfigProvider>
      </QueryClientProvider>,
    );
  });

  it('should render Share button', () => {
    const { getByRole } = render(
      <QueryClientProvider client={queryClient}>
        <SharedUIConfigProvider value={MockSharedUiConfig}>
          <PlatformAdapterProvider adapter={mockPlatformAdapter}>
            <OfferSheetDetailsPage />
          </PlatformAdapterProvider>
        </SharedUIConfigProvider>
      </QueryClientProvider>,
    );

    expect(getByRole('button', { name: /share offer/i })).toBeTruthy();
  });

  it('should render Get discount button', () => {
    const { getByRole } = render(
      <QueryClientProvider client={queryClient}>
        <SharedUIConfigProvider value={MockSharedUiConfig}>
          <PlatformAdapterProvider adapter={mockPlatformAdapter}>
            <OfferSheetDetailsPage />
          </PlatformAdapterProvider>
        </SharedUIConfigProvider>
      </QueryClientProvider>,
    );

    expect(getByRole('button', { name: /Get discount/i })).toBeTruthy();
  });

  // TODO: Fix this test, fire event is not working as expected (not rendering the redemption page)
  // it('should render redemption page once Get Discount button is clicked', async () => {
  //   const { getByRole, debug } = render(<PlatformAdapterProvider adapter={mockPlatformAdapter}><OfferSheetDetailsPage /></PlatformAdapterProvider>);

  //   fireEvent.click(getByRole('button', { name: /get discount/i }));

  //   await waitFor(() => getByRole('button', { name: /code copied!/i }));

  //   debug();
  // });

  it.each([
    ['gift-card', 'Voucher'],
    ['in-store', 'In-store'],
    ['online', 'Online'],
    ['local', 'Local'],
    ['other', 'Other'],
    ['ticket', 'Ticket'],
    ['something ELSE', 'something ELSE'],
  ])('should display labels with jotai state management', (offerType, label) => {
    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <SharedUIConfigProvider value={MockSharedUiConfig}>
          <PlatformAdapterProvider adapter={mockPlatformAdapter}>
            <OfferSheetDetailsPageProvider
              offerSheetAtomData={createOfferSheetAtom({
                offerDetails: createOfferDetails({
                  type: offerType as keyof typeof createOfferDetails,
                }),
              })}
            />
          </PlatformAdapterProvider>
        </SharedUIConfigProvider>
      </QueryClientProvider>,
    );

    const label1 = getByText(label);
    const label2 = getByText(/expiry: 30 Jun 2030/i);

    expect(label1).toBeTruthy();
    expect(label2).toBeTruthy();
  });

  it.each<[string, RedemptionType]>([
    ['Copy discount code', 'generic'],
    ['Get discount', 'preApplied'],
    ['Show your Blue Light Card in store', 'showCard'],
    ['Copy discount code', 'vault'],
    ['Get QR code', 'vaultQR'],
  ])('should show the text "%s" for redemption type "%s"', (buttonText, redemptionType) => {
    const { getByRole } = render(
      <QueryClientProvider client={queryClient}>
        <SharedUIConfigProvider value={MockSharedUiConfig}>
          <PlatformAdapterProvider adapter={mockPlatformAdapter}>
            <OfferSheetDetailsPageProvider
              offerSheetAtomData={createOfferSheetAtom({ redemptionType })}
            />
          </PlatformAdapterProvider>
        </SharedUIConfigProvider>
      </QueryClientProvider>,
    );

    expect(getByRole('button', { name: buttonText })).toBeTruthy();
  });
});
