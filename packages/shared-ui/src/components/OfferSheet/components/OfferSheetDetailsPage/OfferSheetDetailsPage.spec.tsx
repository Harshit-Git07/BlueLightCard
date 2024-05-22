/* eslint-disable @typescript-eslint/no-explicit-any */
import OfferSheetDetailsPage from './';
import { render } from '@testing-library/react';
import { useHydrateAtoms } from 'jotai/utils';
import { Provider } from 'jotai';
import { offerSheetAtom } from '../../store';
import { PlatformAdapterProvider, useMockPlatformAdapter } from 'src/adapters';
import { SharedUIConfigProvider } from 'src/providers';
import { MockSharedUiConfig } from 'src/test';

const mockPlatformAdapter = useMockPlatformAdapter(200, {
  data: {
    redemptionType: 'vault',
    redemptionDetails: {
      url: 'https://www.google.com',
      code: '123456',
    },
  },
});

const HydrateAtoms = ({ initialValues, children }: any) => {
  useHydrateAtoms(initialValues);
  return children;
};

const TestProvider = ({ initialValues, children }: any) => (
  <Provider>
    <HydrateAtoms initialValues={initialValues}>{children}</HydrateAtoms>
  </Provider>
);

const OfferSheetDetailsPageProvider = () => {
  return (
    <TestProvider
      initialValues={[
        [
          offerSheetAtom,
          {
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
              companyId: '4016',
              companyName: 'SEAT',
              offerId: '3802',
            },
          },
        ],
      ]}
    >
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

    expect(getByRole('button', { name: /get discount/i })).toBeTruthy();
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
          <OfferSheetDetailsPageProvider />
        </PlatformAdapterProvider>
      </SharedUIConfigProvider>,
    );

    const label1 = getByText(/online/i);
    const label2 = getByText(/expiry: 30\/06\/2030/i);

    expect(label1).toBeTruthy();
    expect(label2).toBeTruthy();
  });
});
