/* eslint-disable @typescript-eslint/no-explicit-any */
import OfferTopDetailsHeader, { getShareButtonTargetPage } from '.';
import { fireEvent, render } from '@testing-library/react';
import { useHydrateAtoms } from 'jotai/utils';
import { Provider } from 'jotai';
import { OfferSheetAtom, offerSheetAtom } from '../../store';
import { PlatformAdapterProvider, useMockPlatformAdapter } from '../../../../adapters';
import { SharedUIConfigProvider } from 'src/providers';
import { MockSharedUiConfig } from 'src/test';
import { PlatformVariant } from '../../../../types';

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
};

const OfferTopDetailsHeaderProvider = (props: OfferTopDetailsHeaderProviderProps) => {
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
            ...props.value,
          },
        ],
      ]}
    >
      <OfferTopDetailsHeader />
    </TestProvider>
  );
};

describe('smoke test', () => {
  const testCases = [
    {
      description: 'should return "company" when company page experiment returns "treatment"',
      companyPageExperiment: 'treatment',
      companyId: 1,
      offerId: 1,
      expected: '/company?cid=1&oid=1',
    },
    {
      description:
        'should return "offerDetails.php" when company page experiment returns undefined',
      companyPageExperiment: undefined,
      companyId: 2,
      offerId: 2,
      expected: '/offerdetails.php?cid=2&oid=2',
    },
    {
      description: 'should return "offerdetails.php"  company page experiment returns "control"',
      companyPageExperiment: 'control',
      companyId: 3,
      offerId: 3,
      expected: '/offerdetails.php?cid=3&oid=3',
    },
  ];

  testCases.forEach(
    ({
      description,
      companyPageExperiment: companyPageExperiment,
      companyId,
      offerId,
      expected,
    }) => {
      it(description, () => {
        const result = getShareButtonTargetPage(companyPageExperiment, companyId, offerId);
        expect(result).toBe(expected);
      });
    },
  );

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
    const { getByRole, getByText, getByLabelText } = render(
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
});
