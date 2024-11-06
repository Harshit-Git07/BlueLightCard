import { RenderOptions, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TenancyBanner from '@/components/TenancyBanner/index';
import { useRouter } from 'next/router';
import { AuthedAmplitudeExperimentProvider } from '../../../context/AmplitudeExperiment';
import { ExperimentClient } from '@amplitude/experiment-js-client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockTrackTenancyClick = jest.fn();
const mockLogClick = jest.fn();

jest.mock('@/utils/amplitude', () => ({
  trackTenancyClick: (...args: any[]) => mockTrackTenancyClick(...args),
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('swiper/modules', () => ({
  Navigation: () => null,
  Pagination: () => null,
  Autoplay: () => null,
}));

jest.mock('swiper/css', () => jest.fn());

const tenancyBannersMock = jest.fn();

jest.mock('../../TenancyBanner/useTenancyBanners', () => ({
  __esModule: true,
  default: () => tenancyBannersMock(),
}));

const mockExperimentClient = {
  variant: jest.fn().mockReturnValue({ value: 'control' }),
} as unknown as ExperimentClient;

const wrapper: RenderOptions['wrapper'] = ({ children }) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <AuthedAmplitudeExperimentProvider
        initExperimentClient={() => Promise.resolve(mockExperimentClient)}
      >
        {children}
      </AuthedAmplitudeExperimentProvider>
    </QueryClientProvider>
  );
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

    tenancyBannersMock.mockReturnValue({
      loaded: true,
      banners: {
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
            title: 'Test banner title 1',
            __typename: 'Banner',
            logClick: () => mockLogClick(),
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
      },
    });
  });

  it('Should render small TenancyBanner component with no errors', () => {
    const { container } = render(<TenancyBanner variant="small" />, { wrapper });
    expect(container).toMatchSnapshot();
  });

  it('Should render a placeholder if banners have not loaded', () => {
    tenancyBannersMock.mockReturnValue({ loaded: false, banners: {} });

    render(<TenancyBanner variant="small" />, { wrapper });
    const loader = screen.getByTitle('Loading...');

    expect(loader).toBeInTheDocument();
  });

  it('Should render a placeholder if banners are not found', () => {
    tenancyBannersMock.mockReturnValue({ loaded: true, banners: { small: [] } });

    render(<TenancyBanner variant="small" />, { wrapper });
    const loader = screen.getByTitle('Loading...');

    expect(loader).toBeInTheDocument();
  });

  it('Should render large TenancyBanner component with no errors', () => {
    const { container } = render(<TenancyBanner variant="large" />, { wrapper });
    expect(container).toMatchSnapshot();
  });

  it('renders the first 2 banners with small variant', () => {
    render(<TenancyBanner variant="small" />, { wrapper });

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
    render(<TenancyBanner variant="large" />, { wrapper });

    const campaignCards = screen.getAllByRole('img');
    expect(campaignCards).toHaveLength(3);

    expect(campaignCards[0]).toHaveAttribute(
      'src',
      'http://localhost/_next/static/assets/forest.jpeg?width=3840&quality=75'
    );
    expect(campaignCards[0]).toHaveAttribute('alt', 'Test banner title 1 banner');
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

  it('tracks tenancy clicks on banners', () => {
    render(<TenancyBanner title="test_sponsor_banner" variant="large" />, { wrapper });

    const [campaignCard] = screen.getAllByRole('img');
    fireEvent.click(campaignCard);

    expect(mockTrackTenancyClick).toHaveBeenCalledWith('test_sponsor_banner', 'www.google.com');
    expect(mockLogClick).toHaveBeenCalled();
  });

  it('calls logClick on banners', () => {
    render(<TenancyBanner title="test_sponsor_banner" variant="large" />, { wrapper });

    const [campaignCard] = screen.getAllByRole('img');
    fireEvent.click(campaignCard);

    expect(mockLogClick).toHaveBeenCalled();
  });
});
