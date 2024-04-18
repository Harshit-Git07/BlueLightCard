/* eslint-disable @typescript-eslint/no-explicit-any */
import OfferSheetDetailsPage from './';
import { fireEvent, render } from '@testing-library/react';
import { useHydrateAtoms } from 'jotai/utils';
import { Provider } from 'jotai';
import { offerSheetAtom } from '../../store';

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
          },
        ],
      ]}
    >
      <OfferSheetDetailsPage />
    </TestProvider>
  );
};

describe('smoke test', () => {
  it('should render component without error', () => {
    render(<OfferSheetDetailsPage />);
  });

  it('should render Share button', () => {
    const { getByRole } = render(<OfferSheetDetailsPage />);

    expect(getByRole('button', { name: /share offer/i })).toBeTruthy();
  });

  it('should render Get discount button', () => {
    const { getByRole } = render(<OfferSheetDetailsPage />);

    expect(getByRole('button', { name: /get discount/i })).toBeTruthy();
  });

  it('should render redemption page once Get Discount button is clicked', () => {
    const { getByRole, getByText } = render(<OfferSheetDetailsPage />);

    fireEvent.click(getByRole('button', { name: /get discount/i }));

    expect(
      getByText(
        /here should be displayed the redemption controller to display the correct screen for each redemption type/i,
      ),
    ).toBeTruthy();
  });

  it('should display labels with jotai state management', () => {
    const { getByText } = render(<OfferSheetDetailsPageProvider />);

    const label1 = getByText(/online/i);
    const label2 = getByText(/expiry: 30\/06\/2030/i);

    expect(label1).toBeTruthy();
    expect(label2).toBeTruthy();
  });
});
