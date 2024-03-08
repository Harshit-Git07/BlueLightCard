import { render, screen } from '@testing-library/react';
import DesktopShowCardOrQrCode from './DesktopShowCardOrQrCode';
import ReactDOM from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import OfferTopDetailsHeader from '../OfferTopDetailsHeader/OfferTopDetailsHeader';

const mockOfferData = {
  id: '3802',
  name: 'Save with SEAT',
  description:
    'SEAT have put together a discount on the price of a new car.  Visit the link to see some example pricing and your enquiry will be passed to a SEAT approved agent.',
  expiry: '2030-06-30T23:59:59.000Z',
  type: 'Online',
  terms: 'Must be a Blue Light Card member in order to receive the discount.',
  companyId: '4016',
  companyLogo: 'companyimages/complarge/retina/',
};

let container: HTMLDivElement | null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container as HTMLDivElement);
  container = null;
});

describe('renders desktop component with correct elements', () => {
  it('should render desktop component text for redemption type vaultQR', () => {
    act(() => {
      ReactDOM.createRoot(container as HTMLDivElement).render(
        <OfferTopDetailsHeader offerData={mockOfferData} />
      );
    });
    const redemptionType = 'showCard';
    const companyName = 'Test Company';

    render(
      <DesktopShowCardOrQrCode
        redemptionType={redemptionType}
        companyName={companyName}
        companyId={mockOfferData.companyId}
        offerData={mockOfferData}
      />
    );

    // Check if the correct image is rendered
    expect(screen.getByRole('img', { name: /blccard/i })).toBeInTheDocument();

    // Check if the correct texts are rendered
    expect(screen.getByText('Show your Blue Light Card')).toBeInTheDocument();
    expect(screen.getByText('Show your virtual or physical card in store.')).toBeInTheDocument();
  });

  it('should render desktop component text for redemption type vaultQR', () => {
    act(() => {
      ReactDOM.createRoot(container as HTMLDivElement).render(
        <OfferTopDetailsHeader offerData={mockOfferData} />
      );
    });

    const redemptionType = 'vaultQR';
    const companyName = 'Seat';
    render(
      <DesktopShowCardOrQrCode
        redemptionType={redemptionType}
        companyName={companyName}
        companyId={mockOfferData.companyId}
        offerData={mockOfferData}
      />
    );

    // Check if the correct images are rendered
    const getQrCodeImage = screen.getByAltText('getQrCode');
    expect(getQrCodeImage).toBeInTheDocument();

    const showQrCodeImage = screen.getByAltText('showQrCode');
    expect(showQrCodeImage).toBeInTheDocument();

    // Check if the correct texts are rendered
    expect(screen.getByText('1. Get QR code')).toBeInTheDocument();
    expect(
      screen.getByText('Dowloand our app or go to your emails to access QR code.')
    ).toBeInTheDocument();
    expect(screen.getByText('2. Show QR code and enjoy your discount')).toBeInTheDocument();
  });
});
