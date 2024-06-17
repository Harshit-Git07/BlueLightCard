/* eslint-disable @typescript-eslint/no-explicit-any */
import OfferSheetDetailsPage from './';
import { render } from '@testing-library/react';
import { useHydrateAtoms } from 'jotai/utils';
import { Provider } from 'jotai';
import { OfferSheetAtom, offerSheetAtom } from '../../store';
import { PlatformAdapterProvider, useMockPlatformAdapter } from 'src/adapters';
import { SharedUIConfigProvider } from 'src/providers';
import { MockSharedUiConfig } from 'src/test';
import { PlatformVariant } from 'src/types';
import { RedemptionType } from '../../types';

function createFactoryMethod<T>(defaults: T) {
  return (overrides?: Partial<T>): T => ({
    ...defaults,
    ...overrides,
  });
}

const createOfferSheetAtom = createFactoryMethod<OfferSheetAtom>({
  offerDetails: {
    companyId: 4016,
    companyLogo: 'companyimages/complarge/retina/',
    description:
      'SEAT have put together a discount on the price of a new car.  Visit the link to see some example pricing and your enquiry will be passed to a SEAT approved agent.',
    expiry: '2030-06-30T23:59:59.000Z',
    id: 3802,
    name: 'Save with SEAT',
    terms: 'Must be a Blue Light Card member in order to receive the discount.',
    type: 'Online',
  },
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
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should render component without error', () => {
    render(
      <SharedUIConfigProvider value={MockSharedUiConfig}>
        <PlatformAdapterProvider adapter={mockPlatformAdapter}>
          <OfferSheetDetailsPage />
        </PlatformAdapterProvider>
      </SharedUIConfigProvider>,
    );
  });

  it('should render Share button', () => {
    const { getByRole } = render(
      <SharedUIConfigProvider value={MockSharedUiConfig}>
        <PlatformAdapterProvider adapter={mockPlatformAdapter}>
          <OfferSheetDetailsPage />
        </PlatformAdapterProvider>
      </SharedUIConfigProvider>,
    );

    expect(getByRole('button', { name: /share offer/i })).toBeTruthy();
  });

  it('should render Get discount button', () => {
    const { getByRole } = render(
      <SharedUIConfigProvider value={MockSharedUiConfig}>
        <PlatformAdapterProvider adapter={mockPlatformAdapter}>
          <OfferSheetDetailsPage />
        </PlatformAdapterProvider>
      </SharedUIConfigProvider>,
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

  it('should display labels with jotai state management', () => {
    const { getByText } = render(
      <SharedUIConfigProvider value={MockSharedUiConfig}>
        <PlatformAdapterProvider adapter={mockPlatformAdapter}>
          <OfferSheetDetailsPageProvider
            offerSheetAtomData={createOfferSheetAtom({ redemptionType: 'vault' })}
          />
        </PlatformAdapterProvider>
      </SharedUIConfigProvider>,
    );

    const label1 = getByText(/online/i);
    const label2 = getByText(/expiry: 30\/06\/2030/i);

    expect(label1).toBeTruthy();
    expect(label2).toBeTruthy();
  });

  it.each<[string, RedemptionType]>([
    ['Copy discount code', 'generic'],
    ['Get discount', 'preApplied'],
    ['Show your Blue Light Card in store', 'showCard'],
    ['Get discount', 'vault'],
    ['Get QR code', 'vaultQR'],
  ])('should show the text "%s" for redemption type "%s"', (buttonText, redemptionType) => {
    const { getByRole } = render(
      <SharedUIConfigProvider value={MockSharedUiConfig}>
        <PlatformAdapterProvider adapter={mockPlatformAdapter}>
          <OfferSheetDetailsPageProvider
            offerSheetAtomData={createOfferSheetAtom({ redemptionType })}
          />
        </PlatformAdapterProvider>
      </SharedUIConfigProvider>,
    );

    expect(getByRole('button', { name: buttonText })).toBeTruthy();
  });
});
