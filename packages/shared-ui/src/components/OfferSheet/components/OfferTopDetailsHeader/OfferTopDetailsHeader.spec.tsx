/* eslint-disable @typescript-eslint/no-explicit-any */
import OfferTopDetailsHeader from '.';
import { fireEvent, render } from '@testing-library/react';
import { useHydrateAtoms } from 'jotai/utils';
import { Provider } from 'jotai';
import { OfferSheetAtom, offerSheetAtom } from '../../store';
import { PlatformAdapterProvider, useMockPlatformAdapter } from '../../../../adapters';
import { SharedUIConfigProvider } from 'src/providers';
import { MockSharedUiConfig } from 'src/test';
import { convertStringToRichtextModule } from 'src/utils/rich-text-utils';
import { createFactoryMethod } from 'src/utils/createFactoryMethod';

const HydrateAtoms = ({ initialValues, children }: any) => {
  useHydrateAtoms(initialValues);
  return children;
};

const TestProvider = ({ initialValues, children }: any) => (
  <Provider>
    <HydrateAtoms initialValues={initialValues}>{children}</HydrateAtoms>
  </Provider>
);

type OfferTopDetailsHeaderProviderProps = {
  value?: Partial<OfferSheetAtom>;
  variant?: 'offer' | 'event';
};

const createOfferDetails = createFactoryMethod({
  id: '100',
  description: convertStringToRichtextModule(
    'SEAT have put together a discount on the price of a new car.  Visit the link to see some example pricing and your enquiry will be passed to a SEAT approved agent.',
  ),
  expires: '2024-01-01',
  name: 'Save with SEAT',
  termsAndConditions: convertStringToRichtextModule(
    'Must be a Blue Light Card member in order to receive the discount.',
  ),
  type: 'gift-card',
  image: 'companyimages/complarge/retina/cats.jpg',
  companyId: '101',
} as const);

const createEventDetails = createFactoryMethod({
  id: '200',
  description: convertStringToRichtextModule(
    'Join us for an exclusive comedy night featuring Jimmy Carr.',
  ),
  expires: '2024-01-01',
  name: 'Comedy Night with Jimmy Carr',
  termsAndConditions: convertStringToRichtextModule(
    'Must be a Blue Light Card member. Age restriction: 18+',
  ),
  type: 'ticket',
  image: 'eventimages/complarge/retina/comedy.jpg',
  startDate: '2024-01-01T19:00:00Z',
  endDate: '2024-01-01T23:00:00Z',
  guestlistCloseDate: '2023-12-25T23:59:59Z',
  venueName: 'The Comedy Club',
  howItWorks: convertStringToRichtextModule('Book your tickets through the portal.'),
  aboutThisEvent: convertStringToRichtextModule(
    'A night of laughter with one of the UKs top comedians.',
  ),
} as const);

const OfferTopDetailsHeaderProvider = ({
  value,
  variant = 'offer',
}: OfferTopDetailsHeaderProviderProps) => {
  const prpVal =
    variant === 'event'
      ? {
          offerMeta: { offerId: '200' },
          eventDetails: createEventDetails(),
          offerDetails: {},
          redemptionType: 'ballot',
          ...value,
        }
      : {
          offerMeta: {
            companyId: '4016',
            companyName: 'SEAT',
            offerId: '3802',
          },
          offerDetails: createOfferDetails(),
          eventDetails: {},
          redemptionType: 'generic',
          ...value,
        };

  return (
    <TestProvider initialValues={[[offerSheetAtom, prpVal]]}>
      <OfferTopDetailsHeader />
    </TestProvider>
  );
};

describe('smoke test', () => {
  it('should render component without error', () => {
    const platformAdapter = useMockPlatformAdapter();
    render(
      <SharedUIConfigProvider value={MockSharedUiConfig}>
        <PlatformAdapterProvider adapter={platformAdapter}>
          <OfferTopDetailsHeader />
        </PlatformAdapterProvider>
      </SharedUIConfigProvider>,
    );
  });

  it('should render offer details correctly with jotai state management', () => {
    const platformAdapter = useMockPlatformAdapter();
    const { getByRole, getByText } = render(
      <SharedUIConfigProvider value={MockSharedUiConfig}>
        <PlatformAdapterProvider adapter={platformAdapter}>
          <OfferTopDetailsHeaderProvider />
        </PlatformAdapterProvider>
      </SharedUIConfigProvider>,
    );
    expect(getByRole('img', { name: /SEAT logo/i })).toBeTruthy();
    expect(getByRole('heading', { name: /save with seat/i })).toBeTruthy();
    expect(
      getByText(
        /seat have put together a discount on the price of a new car\. visit the link to see some example pricing and your enquiry will be passed to a seat approved agent\./i,
      ),
    ).toBeTruthy();
  });

  it('should render event details correctly ', () => {
    const platformAdapter = useMockPlatformAdapter();
    const { getByText } = render(
      <SharedUIConfigProvider value={MockSharedUiConfig}>
        <PlatformAdapterProvider adapter={platformAdapter}>
          <OfferTopDetailsHeaderProvider variant="event" />
        </PlatformAdapterProvider>
      </SharedUIConfigProvider>,
    );
    expect(getByText(/01 Jan 2024 - 07:00 PM/i)).toBeTruthy();
    expect(getByText(/The Comedy Club/i)).toBeTruthy();
  });

  it('should show event description correctly when "About this event" is clicked', () => {
    const platformAdapter = useMockPlatformAdapter();
    const { getByText } = render(
      <SharedUIConfigProvider value={MockSharedUiConfig}>
        <PlatformAdapterProvider adapter={platformAdapter}>
          <OfferTopDetailsHeaderProvider variant="event" />
        </PlatformAdapterProvider>
      </SharedUIConfigProvider>,
    );

    const dsAccordion = getByText(/About this event/i);

    expect(dsAccordion).toBeTruthy();

    fireEvent.click(dsAccordion);

    expect(getByText(/Join us for an exclusive comedy night featuring Jimmy Carr\./i)).toBeTruthy();
  });

  it('should show event howItWorks correctly when "How It Works" is clicked', () => {
    const platformAdapter = useMockPlatformAdapter();
    const { getByText } = render(
      <SharedUIConfigProvider value={MockSharedUiConfig}>
        <PlatformAdapterProvider adapter={platformAdapter}>
          <OfferTopDetailsHeaderProvider variant="event" />
        </PlatformAdapterProvider>
      </SharedUIConfigProvider>,
    );

    const hwAccordion = getByText(/How It Works/i);

    expect(hwAccordion).toBeTruthy();

    fireEvent.click(hwAccordion);

    expect(getByText(/Book your tickets through the portal\./i)).toBeTruthy();
  });

  it('should show event terms & conditions correctly when "Terms & Conditions" is clicked', () => {
    const platformAdapter = useMockPlatformAdapter();
    const { getByText } = render(
      <SharedUIConfigProvider value={MockSharedUiConfig}>
        <PlatformAdapterProvider adapter={platformAdapter}>
          <OfferTopDetailsHeaderProvider variant="event" />
        </PlatformAdapterProvider>
      </SharedUIConfigProvider>,
    );

    const tcAccordion = getByText(/Terms & Conditions/i);

    expect(tcAccordion).toBeTruthy();

    fireEvent.click(tcAccordion);

    expect(getByText(/Must be a Blue Light Card member. Age restriction: 18\+/i)).toBeTruthy();
  });

  it('should render share offer button', () => {
    const platformAdapter = useMockPlatformAdapter();
    const { getByRole } = render(
      <SharedUIConfigProvider value={MockSharedUiConfig}>
        <PlatformAdapterProvider adapter={platformAdapter}>
          <OfferTopDetailsHeaderProvider />
        </PlatformAdapterProvider>
      </SharedUIConfigProvider>,
    );

    expect(getByRole('button', { name: 'Expand content' })).toBeTruthy();
  });

  it('should render terms & conditions accordion correctly', () => {
    const platformAdapter = useMockPlatformAdapter();
    const { getByRole, getByText } = render(
      <SharedUIConfigProvider value={MockSharedUiConfig}>
        <PlatformAdapterProvider adapter={platformAdapter}>
          <OfferTopDetailsHeaderProvider />
        </PlatformAdapterProvider>
      </SharedUIConfigProvider>,
    );

    const tcAccordion = getByRole('button', { name: 'Expand content' });

    expect(tcAccordion).toBeTruthy();

    fireEvent.click(tcAccordion);

    expect(
      getByText(/must be a blue light card member in order to receive the discount\./i),
    ).toBeTruthy();
  });

  it('should display a QR code if state provides value', () => {
    const platformAdapter = useMockPlatformAdapter();
    const { getByText, getByLabelText } = render(
      <SharedUIConfigProvider value={MockSharedUiConfig}>
        <PlatformAdapterProvider adapter={platformAdapter}>
          <OfferTopDetailsHeaderProvider value={{ qrCodeValue: '123456' }} />
        </PlatformAdapterProvider>
      </SharedUIConfigProvider>,
    );

    expect(getByLabelText(/QR code/i)).toBeTruthy();
    expect(getByText(/123456/i)).toBeTruthy();
  });

  it('should not display a QR code if no value is provided', () => {
    const platformAdapter = useMockPlatformAdapter();
    const { queryByLabelText } = render(
      <SharedUIConfigProvider value={MockSharedUiConfig}>
        <PlatformAdapterProvider adapter={platformAdapter}>
          <OfferTopDetailsHeaderProvider />
        </PlatformAdapterProvider>
      </SharedUIConfigProvider>,
    );

    expect(queryByLabelText(/QR code/i)).toBeNull();
  });

  it('Should show more/less button when description is long', () => {
    const platformAdapter = useMockPlatformAdapter();
    const { getByText } = render(
      <SharedUIConfigProvider value={MockSharedUiConfig}>
        <PlatformAdapterProvider adapter={platformAdapter}>
          <OfferTopDetailsHeaderProvider
            value={{
              offerDetails: createOfferDetails({
                description: convertStringToRichtextModule('help'.repeat(100)),
              }),
            }}
          />
        </PlatformAdapterProvider>
      </SharedUIConfigProvider>,
    );

    const seeMoreButton = getByText('See more...');
    fireEvent.click(seeMoreButton);
    expect(getByText('See less')).toBeTruthy();

    fireEvent.click(getByText('See less'));
    expect(getByText('See more...')).toBeTruthy();
  });
});
