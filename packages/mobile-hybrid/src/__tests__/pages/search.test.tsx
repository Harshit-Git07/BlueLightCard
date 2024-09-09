import { NextRouter } from 'next/router';
import { render, screen } from '@testing-library/react';
import SearchPage from '@/pages/search';
import { JotaiTestProvider } from '@/utils/jotaiTestProvider';
import { experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';
import { FeatureFlags } from '@/components/AmplitudeProvider/amplitudeKeys';
import '@testing-library/jest-dom/extend-expect';
import {
  IPlatformAdapter,
  PlatformAdapterProvider,
  useMockPlatformAdapter,
} from '../../../../shared-ui/src/adapters';

let mockRouter: Partial<NextRouter>;

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

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

describe('Search', () => {
  beforeEach(() => {
    mockRouter = {
      push: jest.fn(),
    };
  });

  describe('Redirect deeplinks', () => {
    it('should redirect to path when match found', () => {
      const mockPlatformAdapter = useMockPlatformAdapter();
      givenDeeplinkQueryParamIs('/offers.php');

      whenSearchPageIsRendered(mockPlatformAdapter);

      expect(mockRouter.push).toHaveBeenCalledWith('/search');
    });

    it('should append original query params to redirect when match found', () => {
      const mockPlatformAdapter = useMockPlatformAdapter();
      givenDeeplinkQueryParamIs('/offers.php?exampleParam1=A');

      whenSearchPageIsRendered(mockPlatformAdapter);

      expect(mockRouter.push).toHaveBeenCalledWith('/search?exampleParam1=A');
    });

    it('should not redirect when deeplink query parameter is not present', async () => {
      const mockPlatformAdapter = useMockPlatformAdapter();
      givenDeeplinkQueryParamIs(undefined);

      whenSearchPageIsRendered(mockPlatformAdapter);

      expect(mockRouter.push).not.toHaveBeenCalled();
    });

    it('should redirect to /search when no matching path found', () => {
      const mockPlatformAdapter = useMockPlatformAdapter();
      givenDeeplinkQueryParamIs('/unknownPath');

      whenSearchPageIsRendered(mockPlatformAdapter);

      expect(mockRouter.push).toHaveBeenCalledWith('/search');
    });

    describe('Search Mapping', () => {
      it.each([
        ['/offers.php?type=1&search=sport', '/searchresults?type=1&search=sport'],
        ['/offers.php?type=5', '/types?type=5'],
        ['/offers.php?cat=true&type=8', '/categories?cat=true&type=8'],
      ])("should map deeplink '%s' to target URL '%s'", (deeplink, targetURL) => {
        const mockPlatformAdapter = useMockPlatformAdapter();
        givenDeeplinkQueryParamIs(deeplink);

        whenSearchPageIsRendered(mockPlatformAdapter);

        expect(mockRouter.push).toHaveBeenCalledWith(targetURL);
      });
    });
  });

  describe('"Search for brands" button', () => {
    it('should show "Search for brands" when feature enabled', () => {
      const mockPlatformAdapter = useMockPlatformAdapter();
      whenSearchPageIsRenderedWithFlags(mockPlatformAdapter, {
        [FeatureFlags.SEARCH_START_PAGE_BRANDS_LINK]: 'on',
      });

      expect(screen.queryByText('Search for brands')).toBeInTheDocument();
    });

    it('should not show "Search for brands" when feature disabled', () => {
      const mockPlatformAdapter = useMockPlatformAdapter();
      whenSearchPageIsRenderedWithFlags(mockPlatformAdapter, {
        [FeatureFlags.SEARCH_START_PAGE_BRANDS_LINK]: 'off',
      });

      expect(screen.queryByText('Search for brands')).not.toBeInTheDocument();
    });

    it('should not show "Search for brands" when feature flag not found', () => {
      const mockPlatformAdapter = useMockPlatformAdapter();
      whenSearchPageIsRenderedWithFlags(mockPlatformAdapter, {});

      expect(screen.queryByText('Search for brands')).not.toBeInTheDocument();
    });
  });

  describe('Categories links', () => {
    it('should show categories links when feature enabled', () => {
      const mockPlatformAdapter = useMockPlatformAdapter();
      whenSearchPageIsRenderedWithFlags(mockPlatformAdapter, {
        [FeatureFlags.SEARCH_START_PAGE_CATEGORIES_LINKS]: 'on',
      });

      expect(screen.queryByText('Browse Categories')).toBeInTheDocument();
    });

    it('should not show categories links when feature disabled', () => {
      const mockPlatformAdapter = useMockPlatformAdapter();
      whenSearchPageIsRenderedWithFlags(mockPlatformAdapter, {
        [FeatureFlags.SEARCH_START_PAGE_CATEGORIES_LINKS]: 'off',
      });

      expect(screen.queryByText('Browse Categories')).not.toBeInTheDocument();
    });

    it('should not show categories links when feature flag not found', () => {
      const mockPlatformAdapter = useMockPlatformAdapter();
      whenSearchPageIsRenderedWithFlags(mockPlatformAdapter, {});

      expect(screen.queryByText('Browse Categories')).not.toBeInTheDocument();
    });
  });

  describe("'Offers near you' button", () => {
    it('should show "Offers near you" when feature enabled', () => {
      const mockPlatformAdapter = useMockPlatformAdapter();
      whenSearchPageIsRenderedWithFlags(mockPlatformAdapter, {
        [FeatureFlags.SEARCH_START_PAGE_OFFERS_NEAR_YOU_LINK]: 'on',
      });

      expect(screen.queryByText('Offers near you')).toBeInTheDocument();
    });

    it('should not show "Offers near you" when feature disabled', () => {
      const mockPlatformAdapter = useMockPlatformAdapter();
      whenSearchPageIsRenderedWithFlags(mockPlatformAdapter, {
        [FeatureFlags.SEARCH_START_PAGE_OFFERS_NEAR_YOU_LINK]: 'off',
      });

      expect(screen.queryByText('Offers near you')).not.toBeInTheDocument();
    });

    it('should not show "Offers near you" when feature flag not found', () => {
      const mockPlatformAdapter = useMockPlatformAdapter();
      whenSearchPageIsRenderedWithFlags(mockPlatformAdapter, {});

      expect(screen.queryByText('Offers near you')).not.toBeInTheDocument();
    });
  });
});

const givenDeeplinkQueryParamIs = (deeplink?: string) => {
  if (deeplink) {
    mockRouter = {
      ...mockRouter,
      query: {
        deeplink: encodeURIComponent(deeplink),
      },
    };
  }
};

const whenSearchPageIsRendered = (mockPlatformAdapter: IPlatformAdapter) => {
  render(
    <PlatformAdapterProvider adapter={mockPlatformAdapter}>
      <SearchPage />
    </PlatformAdapterProvider>,
  );
};

const whenSearchPageIsRenderedWithFlags = (
  mockPlatformAdapter: IPlatformAdapter,
  featureFlags: any,
) => {
  render(
    <PlatformAdapterProvider adapter={mockPlatformAdapter}>
      <JotaiTestProvider initialValues={[[experimentsAndFeatureFlags, featureFlags]]}>
        <SearchPage />
      </JotaiTestProvider>
      ,
    </PlatformAdapterProvider>,
  );
};
