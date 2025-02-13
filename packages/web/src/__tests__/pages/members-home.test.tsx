import '@testing-library/jest-dom';
import AuthContext, { AuthContextType } from '@/context/Auth/AuthContext';
import { as } from '@core/utils/testing';
import _noop from 'lodash/noop';
import { ExperimentClient, Variant } from '@amplitude/experiment-js-client';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UserContext, { UserContextType } from '@/context/User/UserContext';
import { AuthedAmplitudeExperimentProvider } from '@/context/AmplitudeExperiment';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import { NextRouter } from 'next/router';
import HomePage from '@/pages/members-home';
import { Factory } from 'fishery';
import { useMedia } from 'react-use';

import AmplitudeContext from '@/root/src/common/context/AmplitudeContext';
import useFetchHomepageData from '@/hooks/useFetchHomepageData';
import { BannerType, FeaturedOffersType, FlexibleMenuType } from '@/page-types/members-home';
import { PlatformAdapterProvider, useMockPlatformAdapter } from '@bluelightcard/shared-ui/adapters';
import { AmplitudeExperimentFlags } from '../../common/utils/amplitude/AmplitudeExperimentFlags';
import { CardCarouselOffer } from '../../offers/components/CardCarousel/types';

/**
 * GOTCHA: the describe blocks in this file won't always pass in isolation so run
 * them all at once.
 */

jest.mock('@bluelightcard/shared-ui', () => {
  const eventBus = {
    dispatch: jest.fn(),
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
  };

  return {
    __esModule: true,
    EventBus: {
      getInstance: () => eventBus,
      _eventBus: eventBus,
    },
    CampaignCard: ({ name, linkUrl }: any) => (
      <div
        data-testid="campaign-card"
        onClick={() => mockTrackTenancyClick('braze_carousel', linkUrl)}
      >
        <img alt={`${name} banner`} />
      </div>
    ),
    SwiperCarousel: ({ children, onSlideChange }: any) => (
      <div data-testid="swiper-carousel">
        {children}
        <button data-testid="mock-slide-button" onClick={() => onSlideChange?.()} />
      </div>
    ),
    usePlatformAdapter: () => ({
      getAmplitudeFeatureFlag: jest.fn(),
    }),
    useOfferDetails: () => ({
      viewOffer: jest.fn(),
    }),
    PlatformVariant: {
      Web: 'web',
    },
    getBrandedDiscoveryPath: jest.fn(() => '/eu/discovery'),
    getCDNUrl: jest.fn((path) => path),
    cssUtil: {
      injectCss: jest.fn(),
      getCssText: jest.fn(),
    },
    storyUtils: {
      createStory: jest.fn(),
    },
    ageUtils: {
      calculateAge: jest.fn(),
    },
    rewriters: {
      rewriteUrl: jest.fn(),
    },
    useCSSConditional: jest.fn().mockReturnValue(''),
    invoke: jest.fn(),
    OfferCardList: ({ children }: any) => <div>{children}</div>,
    Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
  };
});

jest.mock('../../offers/components/CardCarousel/CardCarousel', () => {
  return function MockCardCarousel({ title, offers, onCarouselInteracted }: any) {
    const testId = title.toLowerCase().replace(/\s+/g, '-');
    return (
      <div data-testid={`card-carousel-${testId}`}>
        <button
          data-testid={`carousel-interaction-${testId}`}
          onClick={() => onCarouselInteracted?.()}
        >
          {title}
        </button>
        {offers.map((offer: any, index: number) => (
          <a
            key={index}
            data-testid={`offer-card-${index}`}
            href={offer.href}
            onClick={() => offer.onClick?.()}
          >
            {offer.offername}
          </a>
        ))}
      </div>
    );
  };
});

jest.mock('../../offers/components/PromoBanner/PromoBanner', () => {
  return function MockPromoBanner({ onClick, id }: any) {
    return (
      <div data-testid={`promo-banner-${id}`} onClick={onClick}>
        Mock Banner
      </div>
    );
  };
});

jest.mock('../../offers/components/PromoBanner/PromoBannerPlaceholder', () => {
  return function MockPromoBannerPlaceholder() {
    return <div data-testid="promo-banner-placeholder">Loading...</div>;
  };
});

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockTrackHomepageCarouselClick = jest.fn();
const mockTrackHomepageCarouselInteraction = jest.fn();
const mockTrackTenancyClick = jest.fn();
const mockLogMembersHomePage = jest.fn();

jest.mock('@/utils/amplitude', () => ({
  trackHomepageCarouselClick: (...args: any[]) => mockTrackHomepageCarouselClick(...args),
  trackHomepageCarouselInteraction: (...args: any[]) =>
    mockTrackHomepageCarouselInteraction(...args),
  trackTenancyClick: (...args: any[]) => mockTrackTenancyClick(...args),
  logMembersHomePage: () => mockLogMembersHomePage(),
}));

jest.mock('@amplitude/analytics-browser', () => ({
  Types: { LogLevel: {} },
  track: jest.fn().mockReturnValue(Promise.resolve()),
}));

jest.mock('react-use', () => ({
  useMedia: jest.fn(),
}));

jest.mock('@/hooks/useIsVisible', () => jest.fn());

jest.mock('@/hooks/useBrazeContentCards', () => ({
  useBrazeContentCards: jest.fn().mockReturnValue([
    {
      imageUrl: 'test-image.jpg',
      url: 'test-link',
      title: 'Test Braze Card',
      isControl: false,
      extras: { destination: 'homepage-sponsor' },
    },
  ]),
}));

jest.mock('@/hooks/useFetchHomepageData');

const useFetchHomepageDataMock = jest.mocked(useFetchHomepageData);

const mockRouter: Partial<NextRouter> = {
  push: jest.fn(),
  isReady: true,
};

const userContextTypeFactory = Factory.define<UserContextType>(() => ({
  dislikes: [],
  error: undefined,
  isAgeGated: false,
  setUser: _noop,
  user: {
    companies_follows: [],
    legacyId: 'mock-legacy-id',
    profile: {
      dob: 'mock-dob',
      organisation: 'mock-organisation',
    },
    uuid: 'mock-uuid',
  },
}));

describe('Members-Home Page', () => {
  beforeEach(() => {
    useFetchHomepageDataMock.mockReturnValue({
      dealsOfTheWeek: [],
      featuredOffers: [],
      flexibleMenu: [],
      flexibleMenusDataTransformedForView: [],
      marketplaceMenus: [],
      banners: [
        {
          imageSource: 'banner.jpg',
          link: 'banner-link',
          legacyCompanyId: '123',
        },
      ],
      hasLoaded: true,
      loadingError: false,
    });
  });

  describe('Tenancy Banner', () => {
    it('renders a promo banner placeholder while Braze experiment is loading', async () => {
      whenMembersHomePageIsRendered({
        [AmplitudeExperimentFlags.MODERN_FLEXI_MENUS]: 'control',
        [AmplitudeExperimentFlags.ENABLE_ALL_FLEXIBLE_MENUS_HOMEPAGE_WEB]: 'off',
        [AmplitudeExperimentFlags.BRAZE_CONTENT_CARDS_ENABLED]: 'control',
      });
      const placeholder = screen.getByTestId('tenancy-banner-experiment-placeholder');
      expect(placeholder).toBeInTheDocument();
    });

    describe('GraphQL banner', () => {
      it('renders when Braze experiment is control', async () => {
        whenMembersHomePageIsRendered({
          [AmplitudeExperimentFlags.MODERN_FLEXI_MENUS]: 'control',
          [AmplitudeExperimentFlags.ENABLE_ALL_FLEXIBLE_MENUS_HOMEPAGE_WEB]: 'off',
          [AmplitudeExperimentFlags.BRAZE_CONTENT_CARDS_ENABLED]: 'control',
        });
        const graphQLCarousel = await screen.findByTestId('homepage-sponsor-banners');
        expect(graphQLCarousel).toBeInTheDocument();
      });

      it('does not render the Braze banner', async () => {
        whenMembersHomePageIsRendered({
          [AmplitudeExperimentFlags.MODERN_FLEXI_MENUS]: 'control',
          [AmplitudeExperimentFlags.ENABLE_ALL_FLEXIBLE_MENUS_HOMEPAGE_WEB]: 'off',
          [AmplitudeExperimentFlags.BRAZE_CONTENT_CARDS_ENABLED]: 'control',
        });
        await screen.findByTestId('homepage-sponsor-banners');
        const brazeCarousel = screen.queryByTestId('braze-tenancy-banner');
        expect(brazeCarousel).not.toBeInTheDocument();
      });
    });

    describe('Braze banner', () => {
      beforeEach(() => {
        whenMembersHomePageIsRendered({
          [AmplitudeExperimentFlags.MODERN_FLEXI_MENUS]: 'treatment',
          [AmplitudeExperimentFlags.ENABLE_ALL_FLEXIBLE_MENUS_HOMEPAGE_WEB]: 'off',
          [AmplitudeExperimentFlags.BRAZE_CONTENT_CARDS_ENABLED]: 'treatment',
        });
      });

      it('renders when Braze experiment is treatment', async () => {
        const brazeCarousel = await screen.findByTestId('braze-tenancy-banner');
        expect(brazeCarousel).toBeInTheDocument();
      });

      it('does not render the GraphQL banner', async () => {
        await screen.findByTestId('braze-tenancy-banner');
        const graphQLCarousel = screen.queryByTestId('homepage-sponsor-banners');
        expect(graphQLCarousel).not.toBeInTheDocument();
      });
    });
  });

  describe('Showing ALL flexible carousels', () => {
    it('should show all flexible carousels when the flag is on', async () => {
      const cardCarouselOffer: CardCarouselOffer = {
        imageUrl: 'mock/image/url',
        href: 'mock/href',
      };

      useFetchHomepageDataMock.mockReturnValue({
        dealsOfTheWeek: [],
        featuredOffers: [],
        flexibleMenu: [],
        flexibleMenusDataTransformedForView: [
          {
            id: 'first-flexible-carousel-id',
            title: 'first-flexible-carousel-title',
            menus: [cardCarouselOffer],
          },
          {
            id: 'second-flexible-carousel-id',
            title: 'second-flexible-carousel-title',
            menus: [cardCarouselOffer],
          },
        ],
        marketplaceMenus: [],
        banners: [],
        hasLoaded: true,
        loadingError: false,
      });

      whenMembersHomePageIsRendered({
        [AmplitudeExperimentFlags.MODERN_FLEXI_MENUS]: 'on',
        [AmplitudeExperimentFlags.ENABLE_ALL_FLEXIBLE_MENUS_HOMEPAGE_WEB]: 'on',
        [AmplitudeExperimentFlags.BRAZE_CONTENT_CARDS_ENABLED]: 'control',
      });
      await waitFor(() => {
        const flexibleCarousels = screen.queryAllByTestId('all-flexible-carousel-display');
        expect(flexibleCarousels.length).toBe(2);
      });
    });

    it('should NOT show any flexible carousels when the flag is off', async () => {
      const cardCarouselOffer: CardCarouselOffer = {
        imageUrl: 'mock/image/url',
        href: 'mock/href',
      };

      useFetchHomepageDataMock.mockReturnValue({
        dealsOfTheWeek: [],
        featuredOffers: [],
        flexibleMenu: [],
        flexibleMenusDataTransformedForView: [
          {
            id: 'first-flexible-carousel-id',
            title: 'first-flexible-carousel-title',
            menus: [cardCarouselOffer],
          },
          {
            id: 'second-flexible-carousel-id',
            title: 'second-flexible-carousel-title',
            menus: [cardCarouselOffer],
          },
        ],
        marketplaceMenus: [],
        banners: [],
        hasLoaded: true,
        loadingError: false,
      });

      whenMembersHomePageIsRendered({
        [AmplitudeExperimentFlags.MODERN_FLEXI_MENUS]: 'on',
        [AmplitudeExperimentFlags.ENABLE_ALL_FLEXIBLE_MENUS_HOMEPAGE_WEB]: 'off',
        [AmplitudeExperimentFlags.BRAZE_CONTENT_CARDS_ENABLED]: 'control',
      });
      await waitFor(() => {
        const flexibleCarousels = screen.queryAllByTestId('all-flexible-carousel-display');
        expect(flexibleCarousels.length).toBe(0);
      });
    });

    it('should NOT show any flexible carousels when the flag is on and the modern flexi menu flag is off', async () => {
      const cardCarouselOffer: CardCarouselOffer = {
        imageUrl: 'mock/image/url',
        href: 'mock/href',
      };

      useFetchHomepageDataMock.mockReturnValue({
        dealsOfTheWeek: [],
        featuredOffers: [],
        flexibleMenu: [],
        flexibleMenusDataTransformedForView: [
          {
            id: 'first-flexible-carousel-id',
            title: 'first-flexible-carousel-title',
            menus: [cardCarouselOffer],
          },
          {
            id: 'second-flexible-carousel-id',
            title: 'second-flexible-carousel-title',
            menus: [cardCarouselOffer],
          },
        ],
        marketplaceMenus: [],
        banners: [],
        hasLoaded: true,
        loadingError: false,
      });

      whenMembersHomePageIsRendered({
        [AmplitudeExperimentFlags.MODERN_FLEXI_MENUS]: 'off',
        [AmplitudeExperimentFlags.ENABLE_ALL_FLEXIBLE_MENUS_HOMEPAGE_WEB]: 'on',
        [AmplitudeExperimentFlags.BRAZE_CONTENT_CARDS_ENABLED]: 'control',
      });
      await waitFor(() => {
        const flexibleCarousels = screen.queryAllByTestId('all-flexible-carousel-display');
        expect(flexibleCarousels.length).toBe(0);
      });
    });

    it('should NOT show the single flexible carousel when the show all flag is on', async () => {
      const cardCarouselOffer: CardCarouselOffer = {
        imageUrl: 'mock/image/url',
        href: 'mock/href',
      };

      useFetchHomepageDataMock.mockReturnValue({
        dealsOfTheWeek: [],
        featuredOffers: [],
        flexibleMenu: [],
        flexibleMenusDataTransformedForView: [
          {
            id: 'first-flexible-carousel-id',
            title: 'first-flexible-carousel-title',
            menus: [cardCarouselOffer],
          },
          {
            id: 'second-flexible-carousel-id',
            title: 'second-flexible-carousel-title',
            menus: [cardCarouselOffer],
          },
        ],
        marketplaceMenus: [],
        banners: [],
        hasLoaded: true,
        loadingError: false,
      });

      whenMembersHomePageIsRendered({
        [AmplitudeExperimentFlags.MODERN_FLEXI_MENUS]: 'on',
        [AmplitudeExperimentFlags.ENABLE_ALL_FLEXIBLE_MENUS_HOMEPAGE_WEB]: 'on',
        [AmplitudeExperimentFlags.BRAZE_CONTENT_CARDS_ENABLED]: 'control',
      });
      await waitFor(() => {
        const flexibleCarousels = screen.queryAllByTestId('flexi-menu-carousel');
        expect(flexibleCarousels.length).toBe(0);
      });
    });
  });
});

describe('Members-Home Page Tracking', () => {
  const useIsVisible = require('@/hooks/useIsVisible');

  beforeEach(() => {
    useIsVisible.mockReturnValue(true);
    (useMedia as jest.Mock).mockReturnValue(false);
    jest.clearAllMocks();
  });

  it('should track deal of the week carousel interaction', async () => {
    const dealOfTheWeek = {
      offername: 'Offer A',
      companyname: 'Company A',
      href: 'url',
      compid: 1,
      id: 2,
      image: 'test.jpg',
      logos: 'logo.jpg',
    };
    useFetchHomepageDataMock.mockReturnValue({
      dealsOfTheWeek: [dealOfTheWeek],
      featuredOffers: [],
      flexibleMenu: [],
      flexibleMenusDataTransformedForView: [],
      marketplaceMenus: [],
      banners: [],
      hasLoaded: true,
      loadingError: false,
    });

    whenMembersHomePageIsRendered({
      [AmplitudeExperimentFlags.MODERN_FLEXI_MENUS]: 'control',
      [AmplitudeExperimentFlags.ENABLE_ALL_FLEXIBLE_MENUS_HOMEPAGE_WEB]: 'off',
      [AmplitudeExperimentFlags.BRAZE_CONTENT_CARDS_ENABLED]: 'control',
    });
    const interactionButton = await screen.findByTestId('carousel-interaction-deals-of-the-week');
    fireEvent.click(interactionButton);

    await waitFor(() => {
      expect(mockTrackHomepageCarouselInteraction).toHaveBeenCalledWith(
        'deals_of_the_week',
        'Deals of the Week'
      );
    });
  });

  it('should track deal of the week offer click', async () => {
    const dealOfTheWeek = {
      offername: 'Offer A',
      companyname: 'Company A',
      href: 'url',
      compid: 1,
      id: 2,
      image: 'test.jpg',
      logos: 'logo.jpg',
    };

    useFetchHomepageDataMock.mockReturnValue({
      dealsOfTheWeek: [dealOfTheWeek],
      featuredOffers: [],
      flexibleMenu: [],
      flexibleMenusDataTransformedForView: [],
      marketplaceMenus: [],
      banners: [],
      hasLoaded: true,
      loadingError: false,
    });

    whenMembersHomePageIsRendered({
      [AmplitudeExperimentFlags.MODERN_FLEXI_MENUS]: 'control',
      [AmplitudeExperimentFlags.ENABLE_ALL_FLEXIBLE_MENUS_HOMEPAGE_WEB]: 'off',
      [AmplitudeExperimentFlags.BRAZE_CONTENT_CARDS_ENABLED]: 'control',
    });
    const offerCard = await screen.findByTestId('offer-card-0');
    fireEvent.click(offerCard);

    await waitFor(() => {
      expect(mockTrackHomepageCarouselClick).toHaveBeenCalledWith(
        'deals_of_the_week',
        'Deals of the Week',
        dealOfTheWeek.id,
        dealOfTheWeek.compid,
        'Company A'
      );
    });
  });

  it('should track sponsor banner clicks', async () => {
    const banner: BannerType = {
      imageSource: 'banner.jpg',
      link: 'banner-link',
      legacyCompanyId: '123',
    };

    useFetchHomepageDataMock.mockReturnValue({
      dealsOfTheWeek: [],
      featuredOffers: [],
      flexibleMenu: [],
      flexibleMenusDataTransformedForView: [],
      marketplaceMenus: [],
      banners: [banner],
      hasLoaded: true,
      loadingError: false,
    });

    whenMembersHomePageIsRendered({
      [AmplitudeExperimentFlags.MODERN_FLEXI_MENUS]: 'control',
      [AmplitudeExperimentFlags.ENABLE_ALL_FLEXIBLE_MENUS_HOMEPAGE_WEB]: 'off',
      [AmplitudeExperimentFlags.BRAZE_CONTENT_CARDS_ENABLED]: 'control',
    });
    const promoBanner = await screen.findByTestId('promo-banner-promoBanner0');
    fireEvent.click(promoBanner);

    await waitFor(() => {
      expect(mockTrackTenancyClick).toHaveBeenCalledWith('homepage_sponsor_banner', banner.link);
    });
  });

  it('should track braze banner clicks when enabled', async () => {
    useFetchHomepageDataMock.mockReturnValue({
      dealsOfTheWeek: [],
      featuredOffers: [],
      flexibleMenu: [],
      flexibleMenusDataTransformedForView: [],
      marketplaceMenus: [],
      banners: [],
      hasLoaded: true,
      loadingError: false,
    });

    whenMembersHomePageIsRendered({
      [AmplitudeExperimentFlags.MODERN_FLEXI_MENUS]: 'control',
      [AmplitudeExperimentFlags.ENABLE_ALL_FLEXIBLE_MENUS_HOMEPAGE_WEB]: 'off',
      [AmplitudeExperimentFlags.BRAZE_CONTENT_CARDS_ENABLED]: 'treatment',
    });
    const brazeBanner = await screen.findByAltText('Test Braze Card banner');
    fireEvent.click(brazeBanner);

    await waitFor(() => {
      expect(mockTrackTenancyClick).toHaveBeenCalledWith('braze_carousel', 'test-link');
    });
  });

  it('should track flexible menu carousel interaction', async () => {
    const flexibleItem: FlexibleMenuType = {
      title: 'Flexible Offer',
      imagehome: 'test.jpg',
      hide: false,
    };

    useFetchHomepageDataMock.mockReturnValue({
      dealsOfTheWeek: [],
      featuredOffers: [],
      flexibleMenu: [flexibleItem],
      flexibleMenusDataTransformedForView: [],
      marketplaceMenus: [],
      banners: [],
      hasLoaded: true,
      loadingError: false,
    });

    whenMembersHomePageIsRendered({
      [AmplitudeExperimentFlags.MODERN_FLEXI_MENUS]: 'control',
      [AmplitudeExperimentFlags.ENABLE_ALL_FLEXIBLE_MENUS_HOMEPAGE_WEB]: 'off',
      [AmplitudeExperimentFlags.BRAZE_CONTENT_CARDS_ENABLED]: 'control',
    });
    const interactionButton = await screen.findByTestId('carousel-interaction-ways-to-save');
    fireEvent.click(interactionButton);

    await waitFor(() => {
      expect(mockTrackHomepageCarouselInteraction).toHaveBeenCalledWith(
        'flexi_menu',
        'Ways to Save'
      );
    });
  });

  it('should track featured offers carousel interaction and click', async () => {
    const featuredOffer: FeaturedOffersType = {
      offername: 'Featured Offer',
      companyname: 'Featured Company',
      compid: 7,
      id: 8,
      image: 'test.jpg',
      logos: 'logo.jpg',
    };

    useFetchHomepageDataMock.mockReturnValue({
      dealsOfTheWeek: [],
      featuredOffers: [featuredOffer],
      flexibleMenusDataTransformedForView: [],
      flexibleMenu: [],
      marketplaceMenus: [],
      banners: [],
      hasLoaded: true,
      loadingError: false,
    });

    whenMembersHomePageIsRendered({
      [AmplitudeExperimentFlags.MODERN_FLEXI_MENUS]: 'control',
      [AmplitudeExperimentFlags.ENABLE_ALL_FLEXIBLE_MENUS_HOMEPAGE_WEB]: 'off',
      [AmplitudeExperimentFlags.BRAZE_CONTENT_CARDS_ENABLED]: 'control',
    });
    const interactionButton = await screen.findByTestId('carousel-interaction-featured-offers');
    fireEvent.click(interactionButton);

    await waitFor(() => {
      expect(mockTrackHomepageCarouselInteraction).toHaveBeenCalledWith(
        'featured_offers',
        'Featured Offers'
      );
    });

    const offerCard = await screen.findByTestId('offer-card-0');
    fireEvent.click(offerCard);

    await waitFor(() => {
      expect(mockTrackHomepageCarouselClick).toHaveBeenCalledWith(
        'featured_offers',
        'Featured Offers',
        featuredOffer.id,
        featuredOffer.compid,
        'Featured Company'
      );
    });
  });
});

describe('Members-Home Page Carousels', () => {
  describe('Flexible carousels', () => {
    describe('With modern flexi menus disabled', () => {
      it('should link to legacy flexible offers page', async () => {
        const flexibleItem: FlexibleMenuType = {
          title: 'Flexible Offer',
          imagehome: 'test.jpg',
          hide: false,
        };

        useFetchHomepageDataMock.mockReturnValue({
          dealsOfTheWeek: [],
          featuredOffers: [],
          flexibleMenu: [flexibleItem],
          flexibleMenusDataTransformedForView: [],
          marketplaceMenus: [],
          banners: [],
          hasLoaded: true,
          loadingError: false,
        });

        whenMembersHomePageIsRendered({
          [AmplitudeExperimentFlags.MODERN_FLEXI_MENUS]: 'control',
          [AmplitudeExperimentFlags.ENABLE_ALL_FLEXIBLE_MENUS_HOMEPAGE_WEB]: 'off',
          [AmplitudeExperimentFlags.BRAZE_CONTENT_CARDS_ENABLED]: 'control',
        });
        const flexibleOfferLink = await screen.findByText('Flexible Offer');
        expect(flexibleOfferLink).toHaveAttribute('href', '/flexibleOffers.php?id=0');
      });
    });

    describe('With modern flexi menus enabled', () => {
      it('should link to modern flexible offers page', async () => {
        const flexibleItem: FlexibleMenuType = {
          id: 'test-flexible-menu-1',
          title: 'Flexible Offer',
          imagehome: 'test.jpg',
          hide: false,
        };

        useFetchHomepageDataMock.mockReturnValue({
          dealsOfTheWeek: [],
          featuredOffers: [],
          flexibleMenu: [flexibleItem],
          flexibleMenusDataTransformedForView: [],
          marketplaceMenus: [],
          banners: [],
          hasLoaded: true,
          loadingError: false,
        });

        whenMembersHomePageIsRendered({
          [AmplitudeExperimentFlags.MODERN_FLEXI_MENUS]: 'on',
          [AmplitudeExperimentFlags.ENABLE_ALL_FLEXIBLE_MENUS_HOMEPAGE_WEB]: 'off',
          [AmplitudeExperimentFlags.BRAZE_CONTENT_CARDS_ENABLED]: 'control',
        });
        const flexibleOfferLink = await screen.findByText('Flexible Offer');
        expect(flexibleOfferLink).toHaveAttribute(
          'href',
          '/flexible-offers?id=test-flexible-menu-1'
        );
      });
    });
  });
});

const WhenMembersHomePageIsRendered = ({
  mockFlagValues,
}: {
  mockFlagValues: Partial<Record<AmplitudeExperimentFlags, string>>;
}) => {
  const mockAuthContext: Partial<AuthContextType> = {
    authState: {
      idToken: '23123',
      accessToken: '111',
      refreshToken: '543',
      username: 'test',
    },
    isUserAuthenticated: as(_noop),
    isReady: true,
  };

  const userContext = userContextTypeFactory.build();

  const mockExperimentClient = {
    variant: jest.fn().mockImplementation((flagName: AmplitudeExperimentFlags): Variant => {
      return { value: mockFlagValues[flagName] };
    }),
  } satisfies Pick<ExperimentClient, 'variant'>;

  const experimentClientMock: () => Promise<ExperimentClient> = () =>
    Promise.resolve(as(mockExperimentClient));

  const mockAmplitudeContext = {
    getAmplitudePromise: jest.fn().mockResolvedValue({}),
    identifyUser: jest.fn(),
    isInitialised: true,
    initialise: jest.fn(),
    setUserId: jest.fn(),
    setSessionId: jest.fn(),
    track: jest.fn(),
    reset: jest.fn(),
    logEvent: jest.fn(),
    _isAmplitudeInitialised: () => true,
    trackEventAsync: jest.fn().mockResolvedValue(undefined),
    trackEvent: jest.fn(),
  };
  const mockPlatformAdapter = useMockPlatformAdapter();

  return (
    <PlatformAdapterProvider adapter={mockPlatformAdapter}>
      <QueryClientProvider client={new QueryClient()}>
        <UserContext.Provider value={userContext}>
          <AuthedAmplitudeExperimentProvider initExperimentClient={experimentClientMock}>
            <RouterContext.Provider value={mockRouter as NextRouter}>
              <AuthContext.Provider value={mockAuthContext as AuthContextType}>
                <AmplitudeContext.Provider value={mockAmplitudeContext}>
                  <UserContext.Provider value={userContext}>
                    <HomePage />
                  </UserContext.Provider>
                </AmplitudeContext.Provider>
              </AuthContext.Provider>
            </RouterContext.Provider>
          </AuthedAmplitudeExperimentProvider>
        </UserContext.Provider>
      </QueryClientProvider>
    </PlatformAdapterProvider>
  );
};

const whenMembersHomePageIsRendered = (
  mockFlagValues: Partial<Record<AmplitudeExperimentFlags, string>>
) => render(<WhenMembersHomePageIsRendered mockFlagValues={mockFlagValues} />);
