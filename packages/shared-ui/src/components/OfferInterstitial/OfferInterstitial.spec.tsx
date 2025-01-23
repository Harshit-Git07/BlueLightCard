import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import OfferInterstitial from '@/components/OfferInterstitial/OfferInterstitial';

describe('OfferInterstitial component', () => {
  const props = {
    isOpen: true,
    imageSource: '/card_test_img.jpg',
    companyName: 'Company name',
    offerName: 'This is an offer',
  };

  jest.mock('next/image', () => {
    return function MockImage() {
      return <></>;
    };
  });

  it('Should render OfferInterstitial component without error', () => {
    render(<OfferInterstitial {...props} />);
  });

  it('Should render an image when isOpen is true', () => {
    const { getByAltText } = render(<OfferInterstitial {...props} />);

    const image = getByAltText('Company name logo') as HTMLImageElement;

    expect(image).toBeInTheDocument();
    expect(decodeURIComponent(image.src)).toContain('/card_test_img.jpg');
  });

  it('Should not render modal when isOpen is false', () => {
    const { queryByText } = render(<OfferInterstitial {...props} isOpen={false} />);

    const modal = queryByText(/code copied!/i);

    expect(modal).not.toBeInTheDocument();
  });
});
