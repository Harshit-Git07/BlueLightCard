/* eslint-disable @typescript-eslint/no-explicit-any */
import OfferTopDetailsHeader from '.';
import { fireEvent, render } from '@testing-library/react';
import { useHydrateAtoms } from 'jotai/utils';
import { Provider } from 'jotai';
import { offerSheetAtom } from '../../store';
import { PlatformAdapterProvider, useMockPlatformAdapter } from '../../../../adapters';

const HydrateAtoms = ({ initialValues, children }: any) => {
  useHydrateAtoms(initialValues);
  return children;
};

const TestProvider = ({ initialValues, children }: any) => (
  <Provider>
    <HydrateAtoms initialValues={initialValues}>{children}</HydrateAtoms>
  </Provider>
);

const OfferTopDetailsHeaderProvider = () => {
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
      <OfferTopDetailsHeader />
    </TestProvider>
  );
};

describe('smoke test', () => {
  it('should render component without error', () => {
    const platformAdapter = useMockPlatformAdapter();
    render(
      <PlatformAdapterProvider adapter={platformAdapter}>
        <OfferTopDetailsHeader />
      </PlatformAdapterProvider>,
    );
  });

  it('should render offer details correctly with jotai state management', () => {
    const platformAdapter = useMockPlatformAdapter();
    const { getByRole, getByText } = render(
      <PlatformAdapterProvider adapter={platformAdapter}>
        <OfferTopDetailsHeaderProvider />
      </PlatformAdapterProvider>,
    );
    expect(getByRole('img', { name: /some dummy alt text here/i })).toBeTruthy();
    expect(getByRole('heading', { name: /save with seat/i })).toBeTruthy();
    expect(
      getByText(
        /seat have put together a discount on the price of a new car\. visit the link to see some example pricing and your enquiry will be passed to a seat approved agent\./i,
      ),
    ).toBeTruthy();
  });

  it('should render share offer button', () => {
    const platformAdapter = useMockPlatformAdapter();
    const { getByRole } = render(
      <PlatformAdapterProvider adapter={platformAdapter}>
        <OfferTopDetailsHeaderProvider />
      </PlatformAdapterProvider>,
    );

    expect(getByRole('button', { name: /terms & conditions/i })).toBeTruthy();
  });

  it('should render terms & conditions accordion correctly', () => {
    const platformAdapter = useMockPlatformAdapter();
    const { getByRole, getByText } = render(
      <PlatformAdapterProvider adapter={platformAdapter}>
        <OfferTopDetailsHeaderProvider />
      </PlatformAdapterProvider>,
    );

    const tcAccordion = getByRole('button', { name: /terms & conditions/i });

    expect(tcAccordion).toBeTruthy();

    fireEvent.click(tcAccordion);

    expect(
      getByText(/must be a blue light card member in order to receive the discount\./i),
    ).toBeTruthy();
  });
});
