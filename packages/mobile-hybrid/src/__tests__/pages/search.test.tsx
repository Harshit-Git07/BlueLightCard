import { NextRouter } from 'next/router';
import { mocked } from 'jest-mock';
import { ReadonlyURLSearchParams } from 'next/dist/client/components/navigation';
import { useSearchParams } from 'next/navigation';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { render } from '@testing-library/react';
import SearchPage from '@/pages/search';

const mockRouter: Partial<NextRouter> = {
  push: jest.fn(),
};

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

describe('Search', () => {
  afterEach(() => {
    jest.resetAllMocks();
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
});

const givenDeeplinkQueryParamIs = (deeplink?: string) => {
  const mockUseSearchParams = mocked(useSearchParams);

  mockUseSearchParams.mockImplementation(() => {
    const params = new URLSearchParams();
    if (deeplink) {
      params.set('deeplink', encodeURIComponent(deeplink));
    }
    return new ReadonlyURLSearchParams(params);
  });
};

const whenSearchPageIsRendered = () => {
  render(
    <RouterContext.Provider value={mockRouter as NextRouter}>
      <SearchPage />
    </RouterContext.Provider>,
  );
};
