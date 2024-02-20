import { NextRouter } from 'next/router';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { render, screen } from '@testing-library/react';
import SearchPage from '@/pages/search';
import { JotaiTestProvider } from '@/utils/jotaiTestProvider';
import { experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';
import { FeatureFlags } from '@/components/AmplitudeProvider/amplitudeKeys';
import '@testing-library/jest-dom/extend-expect';

let mockRouter: Partial<NextRouter>;

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

describe('Search', () => {
  beforeEach(() => {
    mockRouter = {
      push: jest.fn(),
    };
  });

  describe('Redirect deeplinks', () => {
    it('should redirect to path when match found', () => {
      givenDeeplinkQueryParamIs('/offers.php');

      whenSearchPageIsRendered();

      expect(mockRouter.push).toHaveBeenCalledWith('/search');
    });

    it('should append original query params to redirect when match found', () => {
      givenDeeplinkQueryParamIs('/offers.php?exampleParam1=A');

      whenSearchPageIsRendered();

      expect(mockRouter.push).toHaveBeenCalledWith('/search?exampleParam1=A');
    });

    it('should not redirect when deeplink query parameter is not present', async () => {
      givenDeeplinkQueryParamIs(undefined);

      whenSearchPageIsRendered();

      expect(mockRouter.push).not.toHaveBeenCalled();
    });

    it('should redirect to /search when no matching path found', () => {
      givenDeeplinkQueryParamIs('/unknownPath');

      whenSearchPageIsRendered();

      expect(mockRouter.push).toHaveBeenCalledWith('/search');
    });

    describe('Search Mapping', () => {
      it.each([
        ['/offers.php?type=1&search=sport', '/searchresults?type=1&search=sport'],
        ['/offers.php?type=5', '/types?type=5'],
        ['/offers.php?cat=true&type=8', '/categories?cat=true&type=8'],
      ])("should map deeplink '%s' to target URL '%s'", (deeplink, targetURL) => {
        givenDeeplinkQueryParamIs(deeplink);

        whenSearchPageIsRendered();

        expect(mockRouter.push).toHaveBeenCalledWith(targetURL);
      });
    });
  });

  describe('"Search for brands" button', () => {
    it('should show "Search for brands" when feature enabled', () => {
      whenSearchPageIsRenderedWithFlags({
        [FeatureFlags.SEARCH_START_PAGE_BRANDS_LINK]: 'on',
      });

      expect(screen.queryByText('Search for brands')).toBeInTheDocument();
    });

    it('should not show "Search for brands" when feature disabled', () => {
      whenSearchPageIsRenderedWithFlags({
        [FeatureFlags.SEARCH_START_PAGE_BRANDS_LINK]: 'off',
      });

      expect(screen.queryByText('Search for brands')).not.toBeInTheDocument();
    });

    it('should not show "Search for brands" when feature flag not found', () => {
      whenSearchPageIsRenderedWithFlags({});

      expect(screen.queryByText('Search for brands')).not.toBeInTheDocument();
    });
  });

  describe('Categories links', () => {
    it('should show categories links when feature enabled', () => {
      whenSearchPageIsRenderedWithFlags({
        [FeatureFlags.SEARCH_START_PAGE_CATEGORIES_LINKS]: 'on',
      });

      expect(screen.queryByText('Browse Categories')).toBeInTheDocument();
    });

    it('should not show categories links when feature disabled', () => {
      whenSearchPageIsRenderedWithFlags({
        [FeatureFlags.SEARCH_START_PAGE_CATEGORIES_LINKS]: 'off',
      });

      expect(screen.queryByText('Browse Categories')).not.toBeInTheDocument();
    });

    it('should not show categories links when feature flag not found', () => {
      whenSearchPageIsRenderedWithFlags({});

      expect(screen.queryByText('Browse Categories')).not.toBeInTheDocument();
    });
  });

  describe("'Offers near you' button", () => {
    it('should show "Offers near you" when feature enabled', () => {
      whenSearchPageIsRenderedWithFlags({
        [FeatureFlags.SEARCH_START_PAGE_OFFERS_NEAR_YOU_LINK]: 'on',
      });

      expect(screen.queryByText('Offers near you')).toBeInTheDocument();
    });

    it('should not show "Offers near you" when feature disabled', () => {
      whenSearchPageIsRenderedWithFlags({
        [FeatureFlags.SEARCH_START_PAGE_OFFERS_NEAR_YOU_LINK]: 'off',
      });

      expect(screen.queryByText('Offers near you')).not.toBeInTheDocument();
    });

    it('should not show "Offers near you" when feature flag not found', () => {
      whenSearchPageIsRenderedWithFlags({});

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

const whenSearchPageIsRendered = () => {
  render(
    <RouterContext.Provider value={mockRouter as NextRouter}>
      <SearchPage />
    </RouterContext.Provider>,
  );
};

const whenSearchPageIsRenderedWithFlags = (featureFlags: any) => {
  render(
    <RouterContext.Provider value={mockRouter as NextRouter}>
      <JotaiTestProvider initialValues={[[experimentsAndFeatureFlags, featureFlags]]}>
        <SearchPage />
      </JotaiTestProvider>
    </RouterContext.Provider>,
  );
};
