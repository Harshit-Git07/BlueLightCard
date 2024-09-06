import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import Home from '@/pages';
import '@testing-library/jest-dom';
import useOffers from '@/hooks/useOffers';
import { JotaiTestProvider } from '@/utils/jotaiTestProvider';
import { NextRouter } from 'next/router';
import { userProfile, UserProfile } from '@/components/UserProfileProvider/store';
import { experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';
import { Experiments, FeatureFlags } from '@/components/AmplitudeProvider/amplitudeKeys';
import {
  IPlatformAdapter,
  PlatformAdapterProvider,
  useMockPlatformAdapter,
} from '@bluelightcard/shared-ui';

jest.mock('@/invoke/apiCall');
jest.mock('@/modules/popularbrands/brands');
jest.mock('@/hooks/useOffers');
jest.mock('@/hooks/useFavouritedBrands');

jest.mock('swiper/react', () => ({
  Swiper: () => null,
  SwiperSlide: () => null,
}));

jest.mock('swiper/modules', () => ({
  Navigation: () => null,
  Pagination: () => null,
  Autoplay: () => null,
}));

jest.mock('swiper/css', () => jest.fn());
jest.mock('swiper/css/pagination', () => jest.fn());
jest.mock('swiper/css/navigation', () => jest.fn());

const mockRouter: Partial<NextRouter> = {
  push: jest.fn(),
};

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

const useOffersMock = jest.mocked(useOffers);

let userProfileValue: UserProfile = { uuid: 'mock-uuid-1', canRedeemOffer: true, isAgeGated: true };
let amplitudeFlagsAndExperiments: Record<string, string>;
let controlGroup = false;
let mockPlatformAdapter: IPlatformAdapter;

describe('Home', () => {
  mockPlatformAdapter = useMockPlatformAdapter();

  beforeEach(() => {
    jest.resetAllMocks();

    useOffersMock.mockReturnValue({
      flexible: {
        title: 'Flexible offer carousel',
        random: false,
        subtitle: '',
        items: [],
      },
      deal: [],
      groups: [
        {
          title: 'Standard offer carousel',
          random: false,
          items: [],
        },
      ],
    });
    amplitudeFlagsAndExperiments = {
      [Experiments.POPULAR_OFFERS]: 'treatment',
    };
    whenHomePageIsRendered();
  });

  describe('Search Bar', () => {
    const placeholderText = 'Search stores or brands';
    it('should render when home page is rendered', () => {
      const searchBar = screen.queryByPlaceholderText(placeholderText);
      expect(searchBar).toBeInTheDocument();
    });
  });

  describe('Popular brands', () => {
    it('should render popular brands when home page is rendered and popular offers experiment  is in treatment group - blc-uk', () => {
      const popularBrandsTitle = screen.queryByText('Popular brands');
      expect(popularBrandsTitle).toBeInTheDocument();
    });
  });

  describe('Offers', () => {
    it("should render 'Flexible offer carousel' when home page is rendered", () => {
      const flexibleOfferCarousel = screen.getByText('Flexible offer carousel');
      expect(flexibleOfferCarousel).toBeInTheDocument();
    });

    it("should render 'Standard offer carousel' when home page is rendered", () => {
      const standardOfferCarousel = screen.getByText('Standard offer carousel');
      expect(standardOfferCarousel).toBeInTheDocument();
    });
  });

  describe('News', () => {
    it('should render news page when home page is rendered', () => {
      const newsTitle = screen.getByText('Latest news');
      expect(newsTitle).toBeInTheDocument();
    });
  });

  describe('Home page ordering ', () => {
    it('should render popular brands, offer carousels, latest news in descending order when home page is rendered', () => {
      const popularBrandsTitle = screen.queryByText('Popular brands');
      const standardOfferCarousel = screen.getByText('Standard offer carousel');
      const flexibleOfferCarousel = screen.getByText('Flexible offer carousel');
      const newsTitle = screen.getByText('Latest news');

      expect(elementIsBeneath(popularBrandsTitle, standardOfferCarousel)).toBe(true);
      expect(elementIsBeneath(flexibleOfferCarousel, newsTitle)).toBe(true);
    });
  });

  describe('Thank You Campaign', () => {
    it('does not render the campaign banner when the user UUID is undefined', () => {
      userProfileValue.uuid = undefined;
      amplitudeFlagsAndExperiments = {
        [FeatureFlags.THANK_YOU_CAMPAIGN]: 'on',
      };
      whenHomePageIsRendered();

      const campaignBanner = screen.queryByTestId('campaign-banner');

      expect(campaignBanner).not.toBeInTheDocument();

      userProfileValue.uuid = 'mock-uuid-1';
    });

    it('does not render the campaign banner when the user cannot redeem offers', () => {
      userProfileValue.canRedeemOffer = false;
      amplitudeFlagsAndExperiments = {
        [FeatureFlags.THANK_YOU_CAMPAIGN]: 'on',
      };
      whenHomePageIsRendered();

      const campaignBanner = screen.queryByTestId('campaign-banner');

      expect(campaignBanner).not.toBeInTheDocument();

      userProfileValue.canRedeemOffer = true;
    });

    it('does not render the campaign banner when the user is not past the age gate', () => {
      userProfileValue.isAgeGated = false;
      amplitudeFlagsAndExperiments = {
        [FeatureFlags.THANK_YOU_CAMPAIGN]: 'on',
      };
      whenHomePageIsRendered();

      const campaignBanner = screen.queryByTestId('campaign-banner');

      expect(campaignBanner).not.toBeInTheDocument();

      userProfileValue.isAgeGated = true;
    });

    it('does not render the campaign banner when the feature flag is disabled', () => {
      amplitudeFlagsAndExperiments = {
        [FeatureFlags.THANK_YOU_CAMPAIGN]: 'off',
      };
      whenHomePageIsRendered();

      const campaignBanner = screen.queryByTestId('campaign-banner');

      expect(campaignBanner).not.toBeInTheDocument();
    });

    it('renders the campaign banner when the feature flag is enabled', async () => {
      mockPlatformAdapter.invokeV5Api = jest.fn().mockResolvedValue({
        statusCode: 200,
        data: JSON.stringify({
          data: [
            {
              id: '1',
              content: {
                imageURL: '/spin_to_win.jpg',
                iframeURL: 'https://campaign.odicci.com/#/2031feeae3808e7b8802',
              },
            },
          ],
        }),
      });

      amplitudeFlagsAndExperiments = {
        [FeatureFlags.THANK_YOU_CAMPAIGN]: 'on',
      };
      whenHomePageIsRendered();

      const campaignBanner = await screen.findByTestId('campaign-banner');

      expect(campaignBanner).toBeInTheDocument();
    });

    it('navigates to the Odicci campaign page when the campaign banner is clicked', async () => {
      mockPlatformAdapter.invokeV5Api = jest.fn().mockResolvedValue({
        statusCode: 200,
        data: JSON.stringify({
          data: [
            {
              id: '1',
              content: {
                imageURL: '/spin_to_win.jpg',
                iframeURL: 'https://campaign.odicci.com/#/2031feeae3808e7b8802',
              },
            },
          ],
        }),
      });

      amplitudeFlagsAndExperiments = {
        [FeatureFlags.THANK_YOU_CAMPAIGN]: 'on',
      };
      whenHomePageIsRendered();

      const campaignBanner = await screen.findByTestId('campaign-banner');
      const image = campaignBanner.querySelector('div > div > div > img');

      if (!image) throw new Error('Banner image is not in the document');

      await userEvent.click(image);

      expect(mockRouter.push).toHaveBeenCalledWith(
        '/odicci-iframe-campaign?iframeUrl=https%3A%2F%2Fcampaign.odicci.com%2F%23%2F2031feeae3808e7b8802',
      );
    });
  });
});

// This test is only needed until popular brands are introduced to blc-au & dds, after that it can be deleted.
describe('Popular brands blc-aus & dds ', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    useOffersMock.mockReturnValue({
      flexible: {
        title: 'Flexible offer carousel',
        random: false,
        subtitle: '',
        items: [],
      },
      deal: [],
      groups: [
        {
          title: 'Standard offer carousel',
          random: false,
          items: [],
        },
      ],
    });
    amplitudeFlagsAndExperiments = {
      [Experiments.POPULAR_OFFERS]: 'control',
    };
    whenHomePageIsRendered();
  });
  it('should render popular brands when home page is rendered and popular offers experiment is in control group - blc-au & dds', () => {
    const popularBrandsTitle = screen.queryByText('Popular brands');
    expect(popularBrandsTitle).not.toBeInTheDocument();
  });
});

// Utility function to determine if a selected html element appears below another
function elementIsBeneath(elementOne: HTMLElement | null, elementTwo: HTMLElement | null): boolean {
  if (!elementOne || !elementTwo) {
    throw new Error('Both elements must be present');
  }
  return !!(elementOne.compareDocumentPosition(elementTwo) & Node.DOCUMENT_POSITION_FOLLOWING);
}

const whenHomePageIsRendered = () => {
  render(
    <PlatformAdapterProvider adapter={mockPlatformAdapter}>
      <JotaiTestProvider
        initialValues={[
          [experimentsAndFeatureFlags, amplitudeFlagsAndExperiments],
          [userProfile, userProfileValue],
        ]}
      >
        <Home />
      </JotaiTestProvider>
    </PlatformAdapterProvider>,
  );
};
