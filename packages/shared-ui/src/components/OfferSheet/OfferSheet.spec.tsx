/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlatformVariant } from '../../types';
import OfferSheet, { Props } from '.';
import { render } from '@testing-library/react';
import { PlatformAdapterProvider, useMockPlatformAdapter } from 'src/adapters';

const mockPlatformAdapter = useMockPlatformAdapter(200, { data: { redemptionType: 'vault' } });

const props: Props = {
  platform: PlatformVariant.Web,
  isOpen: false,
  onClose: jest.fn(),
  height: '90%',
  offerMeta: {
    offerId: 3802,
    companyId: 4016,
    companyName: 'SEAT',
  },
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
  offerStatus: 'success',
  cdnUrl: 'https://cdn.bluelightcard.co.uk',
  isMobileHybrid: false,
  amplitudeEvent: jest.fn(),
  BRAND: 'blc-uk',
};

describe('smoke test', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should render component without error', () => {
    render(
      <PlatformAdapterProvider adapter={mockPlatformAdapter}>
        <OfferSheet {...props} />
      </PlatformAdapterProvider>,
    );
  });

  it('should render close button', () => {
    const { container } = render(
      <PlatformAdapterProvider adapter={mockPlatformAdapter}>
        <OfferSheet {...props} />
      </PlatformAdapterProvider>,
    );

    const closeButton = container.querySelector(
      'div > div > div > div:nth-child(2) > div:nth-child(1)',
    );

    expect(closeButton).toBeTruthy();
  });

  it('should render offer details', () => {
    const { getByRole, getByText } = render(
      <PlatformAdapterProvider adapter={mockPlatformAdapter}>
        <OfferSheet {...props} />
      </PlatformAdapterProvider>,
    );

    expect(getByRole('button', { name: /get discount/i })).toBeTruthy();
    expect(getByText(/Save with SEAT/i)).toBeTruthy();
  });
});
