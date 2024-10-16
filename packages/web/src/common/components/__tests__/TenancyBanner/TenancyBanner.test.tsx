import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TenancyBanner from '@/components/TenancyBanner/index';
import TenancyBannerPresenter from '../../TenancyBanner/Components/TenancyBannerPresenter';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('swiper/modules', () => ({
  Navigation: () => null,
  Pagination: () => null,
  Autoplay: () => null,
}));

jest.mock('swiper/css', () => jest.fn());

const mockBannersData = {
  small: [
    {
      imageSource: '/assets/forest.jpeg',
      link: 'www.google.com',
      __typename: 'Banner',
    },
    {
      imageSource: '/assets/forest.jpeg',
      link: 'www.apple.com',
      __typename: 'Banner',
    },
  ],
  large: [
    {
      imageSource: '/assets/forest.jpeg',
      legacyCompanyId: 123,
      link: 'www.google.com',
      __typename: 'Banner',
    },
    {
      imageSource: '/assets/forest.jpeg',
      legacyCompanyId: 456,
      link: 'www.google.com',
      __typename: 'Banner',
    },
    {
      imageSource: '/assets/forest.jpeg',
      legacyCompanyId: 789,
      link: 'www.apple.com',
      __typename: 'Banner',
    },
  ],
};

describe('TenancyBanner component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
    });
  });

  it('Should render TenancyBanner component with no errors', () => {
    const { container } = render(<TenancyBanner />);
    expect(container).toMatchSnapshot();
  });

  it('renders the first 2 banners with small variant', () => {
    render(<TenancyBannerPresenter variant="small" bannersData={mockBannersData} />);

    const campaignCards = screen.getAllByRole('img');
    expect(campaignCards).toHaveLength(2);

    expect(campaignCards[0]).toHaveAttribute(
      'src',
      'http://localhost/_next/static/assets/forest.jpeg?width=3840&quality=75'
    );
    expect(campaignCards[0]).toHaveAttribute('alt', 'banner-0 banner');
    expect(campaignCards[1]).toHaveAttribute(
      'src',
      'http://localhost/_next/static/assets/forest.jpeg?width=3840&quality=75'
    );
    expect(campaignCards[1]).toHaveAttribute('alt', 'banner-1 banner');
  });

  it('renders the last 3 banners with large variant', () => {
    render(<TenancyBannerPresenter variant="large" bannersData={mockBannersData} />);

    const campaignCards = screen.getAllByRole('img');
    expect(campaignCards).toHaveLength(3);

    expect(campaignCards[0]).toHaveAttribute(
      'src',
      'http://localhost/_next/static/assets/forest.jpeg?width=3840&quality=75'
    );
    expect(campaignCards[0]).toHaveAttribute('alt', 'banner-0 banner');
    expect(campaignCards[1]).toHaveAttribute(
      'src',
      'http://localhost/_next/static/assets/forest.jpeg?width=3840&quality=75'
    );
    expect(campaignCards[1]).toHaveAttribute('alt', 'banner-1 banner');
    expect(campaignCards[2]).toHaveAttribute(
      'src',
      'http://localhost/_next/static/assets/forest.jpeg?width=3840&quality=75'
    );
    expect(campaignCards[2]).toHaveAttribute('alt', 'banner-2 banner');
  });
});
