import SearchResultsPage from '@/pages/searchresults';
import { act, render, screen, waitFor } from '@testing-library/react';
import { experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';
import { JotaiTestProvider } from '@/utils/jotaiTestProvider';
import { NextRouter } from 'next/router';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import '@testing-library/jest-dom/extend-expect';
import { Experiments, FeatureFlags } from '@/components/AmplitudeProvider/amplitudeKeys';
import InvokeNativeAPICall from '@/invoke/apiCall';
import { APIUrl, V5_API_URL } from '@/globals';
import { FC, PropsWithChildren } from 'react';
import Spinner from '@/modules/Spinner';
import { PlatformAdapterProvider, useMockPlatformAdapter } from '@bluelightcard/shared-ui';
import { SearchResultsV5 } from '@/modules/SearchResults/types';
import { searchResultV5Factory } from '@/modules/List/__mocks__/factory';
import { userProfile } from '@/components/UserProfileProvider/store';

jest.mock('@/invoke/apiCall');
jest.mock('@/invoke/analytics');

let searchValue = '';
const testDataV5: SearchResultsV5 = searchResultV5Factory.buildList(1);
const mockRouter: Partial<NextRouter> = {
  push: jest.fn(),
  query: {
    search: searchValue,
  },
};

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

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('Search Results', () => {
  const mockPlatformAdapter = useMockPlatformAdapter();

  describe('Feature Flags', () => {
    it('should show browse categories when feature enabled', async () => {
      await whenPageIsRenderedWithFlags({
        [FeatureFlags.SEARCH_RESULTS_PAGE_CATEGORIES_LINKS]: 'on',
      });

      expect(screen.queryByText('Browse Categories')).toBeInTheDocument();
    });

    it('should not show browse categories when feature disabled', async () => {
      await whenPageIsRenderedWithFlags({
        [FeatureFlags.SEARCH_RESULTS_PAGE_CATEGORIES_LINKS]: 'off',
      });

      expect(screen.queryByText('Browse Categories')).not.toBeInTheDocument();
    });

    it('should not show browse categories when feature flag not found', async () => {
      await whenPageIsRenderedWithFlags({});

      expect(screen.queryByText('Browse Categories')).not.toBeInTheDocument();
    });
  });

  describe('Search query params', () => {
    it('should set the search term from the query params', async () => {
      if (mockRouter.query) {
        mockRouter.query.search = 'test search value';
      }

      const requestMock = jest
        .spyOn(InvokeNativeAPICall.prototype, 'requestDataAsync')
        .mockResolvedValue({ success: true, data: [] });

      await act(() =>
        whenPageIsRenderedWithFlags({ [Experiments.CATEGORY_LEVEL_THREE_SEARCH]: 'control' }),
      );

      expect(requestMock).toHaveBeenCalledWith(APIUrl.Search, {
        term: 'test search value',
      });

      if (mockRouter.query) {
        mockRouter.query.search = '';
      }
    });

    it('should set the search term from the query params when level three search experiment is on ', async () => {
      if (mockRouter.query) {
        mockRouter.query.search = 'test search value';
      }

      const mockPlatformAdapter = useMockPlatformAdapter(200, {
        data: testDataV5,
      });
      mockPlatformAdapter.getAmplitudeFeatureFlag.mockReturnValue('treatment');

      await act(() =>
        whenPageIsRenderedWithFlags(
          {
            [Experiments.CATEGORY_LEVEL_THREE_SEARCH]: 'treatment',
            [FeatureFlags.V5_API_INTEGRATION]: 'on',
          },
          mockPlatformAdapter,
        ),
      );

      await waitFor(() => {
        expect(mockPlatformAdapter.invokeV5Api).toHaveBeenCalledTimes(1);
        expect(mockPlatformAdapter.invokeV5Api).toHaveBeenCalledWith(V5_API_URL.Search, {
          method: 'GET',
          queryParameters: {
            query: 'test search value',
            organisation: 'test-organisation',
            isAgeGated: 'true',
          },
          cachePolicy: 'auto',
        });
      });

      if (mockRouter.query) {
        mockRouter.query.search = '';
      }
    });

    it('should show the spinner when search is made', async () => {
      await whenPageIsRenderedWithFlags({ [Experiments.CATEGORY_LEVEL_THREE_SEARCH]: 'control' });

      const spinner = screen.findByRole('progressbar');
      expect(spinner).toBeTruthy();
    });

    it('should show the spinner when search is made with level three experiment on', async () => {
      const mockPlatformAdapter = useMockPlatformAdapter(200, {
        data: testDataV5,
      });

      await whenPageIsRenderedWithFlags(
        { [Experiments.CATEGORY_LEVEL_THREE_SEARCH]: 'treatment' },
        mockPlatformAdapter,
      );

      await waitFor(() => {
        const spinner = screen.findByRole('progressbar');
        expect(spinner).toBeTruthy();
      });
    });
  });

  const WithSpinner: FC<PropsWithChildren> = ({ children }) => {
    return (
      <div>
        {children}
        <Spinner />
      </div>
    );
  };

  const whenPageIsRenderedWithFlags = async (
    featureFlags: any,
    platformAdapter = mockPlatformAdapter,
  ) => {
    await act(() =>
      render(
        <PlatformAdapterProvider adapter={platformAdapter}>
          <RouterContext.Provider value={mockRouter as NextRouter}>
            <JotaiTestProvider
              initialValues={[
                [experimentsAndFeatureFlags, featureFlags],
                [userProfile, { service: 'test-organisation', isAgeGated: true }],
              ]}
            >
              <WithSpinner>
                <SearchResultsPage />
              </WithSpinner>
            </JotaiTestProvider>
          </RouterContext.Provider>
        </PlatformAdapterProvider>,
      ),
    );
  };
});
