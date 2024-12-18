/* eslint-disable @typescript-eslint/no-explicit-any */
import OfferSheetDetailsPage from './';
import { fireEvent, render, waitFor } from '@testing-library/react';
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
import { V2ApisGetEventResponse, V2ApisGetOfferResponse } from '@blc-mono/offers-cms/api';

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

const createEventDetails = createFactoryMethod({
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
  statusCode: 200,
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

    expect(getByRole('button', { name: /share/i })).toBeTruthy();
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

  it('should display labels for events with jotai state management for ballot redemption type', () => {
    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <SharedUIConfigProvider value={MockSharedUiConfig}>
          <PlatformAdapterProvider adapter={mockPlatformAdapter}>
            <OfferSheetDetailsPageProvider
              offerSheetAtomData={createOfferSheetAtom({
                eventDetails: createEventDetails(),
                redemptionType: 'ballot',
              })}
            />
          </PlatformAdapterProvider>
        </SharedUIConfigProvider>
      </QueryClientProvider>,
    );

    const label = getByText('Ticket');

    expect(label).toBeTruthy();
  });

  it.each<[string, RedemptionType]>([
    ['Copy discount code', 'generic'],
    ['Get discount', 'preApplied'],
    ['Show your Blue Light Card in store', 'showCard'],
    ['Copy discount code', 'vault'],
    ['Get QR code', 'vaultQR'],
    ['Enter ballot', 'ballot'],
  ])('should show the text "%s" for redemption type "%s"', (buttonText, redemptionType) => {
    const { getByRole } = render(
      <QueryClientProvider client={queryClient}>
        <SharedUIConfigProvider value={MockSharedUiConfig}>
          <PlatformAdapterProvider adapter={mockPlatformAdapter}>
            <OfferSheetDetailsPageProvider
              offerSheetAtomData={createOfferSheetAtom({
                redemptionType,
                offerDetails: {} as V2ApisGetOfferResponse,
                eventDetails: {} as V2ApisGetEventResponse,
              })}
            />
          </PlatformAdapterProvider>
        </SharedUIConfigProvider>
      </QueryClientProvider>,
    );

    expect(getByRole('button', { name: buttonText })).toBeTruthy();
  });

  it('should show success message on redeemed event for ballot redemptionType', async () => {
    const { getByRole, getByText } = render(
      <QueryClientProvider client={queryClient}>
        <SharedUIConfigProvider value={MockSharedUiConfig}>
          <PlatformAdapterProvider adapter={mockPlatformAdapter}>
            <OfferSheetDetailsPageProvider
              offerSheetAtomData={createOfferSheetAtom({
                redemptionType: 'ballot',
                eventDetails: createEventDetails(),
              })}
            />
          </PlatformAdapterProvider>
        </SharedUIConfigProvider>
      </QueryClientProvider>,
    );

    fireEvent.click(getByRole('button', { name: /Enter ballot/i }));

    await waitFor(() => {
      expect(getByText(/Entry received/i)).toBeTruthy();
      expect(getByText(/We’ll let you know if you’ve won via email/i)).toBeTruthy();
    });
  });

  it('should show correct error message on redeemed event when already entered ballot', async () => {
    const platformAdapter = useMockPlatformAdapter(200, {
      statusCode: 409,
      data: {},
    });

    const { getByRole, getByText } = render(
      <QueryClientProvider client={queryClient}>
        <SharedUIConfigProvider value={MockSharedUiConfig}>
          <PlatformAdapterProvider adapter={platformAdapter}>
            <OfferSheetDetailsPageProvider
              offerSheetAtomData={createOfferSheetAtom({
                redemptionType: 'ballot',
                eventDetails: createEventDetails(),
              })}
            />
          </PlatformAdapterProvider>
        </SharedUIConfigProvider>
      </QueryClientProvider>,
    );

    fireEvent.click(getByRole('button', { name: /Enter ballot/i }));

    await waitFor(() => {
      expect(
        getByText(
          /It looks like you’ve already entered this ballot! We’ll let you know if you’ve won via email./i,
        ),
      ).toBeTruthy();
    });
  });

  it('should show correct error message on redeemed event when redeem endpoint returns a 403 for ballot', async () => {
    const platformAdapter = useMockPlatformAdapter(200, {
      statusCode: 403,
      data: {},
    });

    const { getByRole, getByText } = render(
      <QueryClientProvider client={queryClient}>
        <SharedUIConfigProvider value={MockSharedUiConfig}>
          <PlatformAdapterProvider adapter={platformAdapter}>
            <OfferSheetDetailsPageProvider
              offerSheetAtomData={createOfferSheetAtom({
                redemptionType: 'ballot',
                eventDetails: createEventDetails(),
              })}
            />
          </PlatformAdapterProvider>
        </SharedUIConfigProvider>
      </QueryClientProvider>,
    );

    fireEvent.click(getByRole('button', { name: /Enter ballot/i }));

    await waitFor(() => {
      expect(
        getByText(
          /This competition is for active card holders only. Please check the status of your account./i,
        ),
      ).toBeTruthy();
    });
  });
});
