import SearchResultsPage from '@/pages/searchresults';
import { act, render, screen, waitFor } from '@testing-library/react';
import { experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { JotaiTestProvider } from '@/utils/jotaiTestProvider';
import { NextRouter } from 'next/router';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import '@testing-library/jest-dom/extend-expect';
import { Experiments, FeatureFlags } from '@/components/AmplitudeProvider/amplitudeKeys';
import InvokeNativeAPICall from '@/invoke/apiCall';
import { APIUrl, V5_API_URL } from '@/globals';
import { FC, PropsWithChildren } from 'react';
import Spinner from '@/modules/Spinner';
import {
  PlatformAdapterProvider,
  categoriesMock,
  useMockPlatformAdapter,
} from '@bluelightcard/shared-ui';
import { SearchResultsV5 } from '@/modules/SearchResults/types';
import { searchResultV5Factory } from '@/modules/List/__mocks__/factory';
import { userProfile } from '@/components/UserProfileProvider/store';

jest.mock('@/invoke/analytics');

let searchValue = '';
const testDataV5: SearchResultsV5 = searchResultV5Factory.buildList(2);
testDataV5[1].offerimg = '';
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

describe('Search Results', () => {
  const mockPlatformAdapter = useMockPlatformAdapter(200, { data: categoriesMock });

  describe('Feature Flags', () => {
    it('should show browse categories when feature enabled', async () => {
      await whenPageIsRenderedWithFlags({
        [FeatureFlags.MODERN_CATEGORIES_HYBRID]: 'on',
      });

      const categoryName = await screen.findByText(categoriesMock[0].name);
      expect(categoryName).toBeInTheDocument();
    });

    it('should not show browse categories when feature disabled', async () => {
      await whenPageIsRenderedWithFlags({
        [FeatureFlags.MODERN_CATEGORIES_HYBRID]: 'off',
      });

      await waitFor(() => {
        expect(screen.queryByText('Browse Categories')).not.toBeInTheDocument();
      });
    });

    it('should not show browse categories when feature flag not found', async () => {
      await whenPageIsRenderedWithFlags({});

      await waitFor(() => {
        expect(screen.queryByText('Browse Categories')).not.toBeInTheDocument();
      });
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

      await act(() => whenPageIsRenderedWithFlags({ [Experiments.SEARCH_V5]: 'control' }));

      expect(requestMock).toHaveBeenCalledWith(APIUrl.Search, {
        term: 'test search value',
      });

      if (mockRouter.query) {
        mockRouter.query.search = '';
      }
    });

    it('should set the search term from the query params when  searchV5 experiment is on ', async () => {
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
            [Experiments.SEARCH_V5]: 'treatment',
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
          },
          cachePolicy: 'auto',
        });
      });

      if (mockRouter.query) {
        mockRouter.query.search = '';
      }
    });

    it('should show the spinner when search is made', async () => {
      await whenPageIsRenderedWithFlags({ [Experiments.SEARCH_V5]: 'control' });

      const spinner = screen.findByRole('progressbar');
      expect(spinner).toBeTruthy();
    });

    it('should show the spinner when search is made with searchV5 experiment on', async () => {
      const mockPlatformAdapter = useMockPlatformAdapter(200, {
        data: testDataV5,
      });

      await whenPageIsRenderedWithFlags(
        { [Experiments.SEARCH_V5]: 'treatment' },
        mockPlatformAdapter,
      );

      await waitFor(() => {
        const spinner = screen.findByRole('progressbar');
        expect(spinner).toBeTruthy();
      });
    });
  });

  describe('Offer results', () => {
    beforeEach(async () => {
      if (mockRouter.query) {
        mockRouter.query.search = 'test search value';
      }

      const mockPlatformAdapter = useMockPlatformAdapter(200, {
        data: testDataV5,
      });
      mockPlatformAdapter.getAmplitudeFeatureFlag.mockReturnValue('treatment');

      await whenPageIsRenderedWithFlags(
        {
          [Experiments.SEARCH_V5]: 'treatment',
          [FeatureFlags.V5_API_INTEGRATION]: 'on',
        },
        mockPlatformAdapter,
      );
    });

    afterEach(() => {
      if (mockRouter.query) {
        mockRouter.query.search = '';
      }
    });

    it('should render the offer name', async () => {
      const offerName = await screen.findByText(testDataV5[0].OfferName);
      expect(offerName).toBeInTheDocument();
    });

    it('should render the company name', async () => {
      const companyName = await screen.findByText(testDataV5[0].CompanyName);
      expect(companyName).toBeInTheDocument();
    });

    it('should render the offer image', async () => {
      const offerImage = await screen.findByAltText(testDataV5[0].OfferName);
      expect(offerImage).toHaveAttribute('src', expect.stringContaining('offer-image-0'));
    });

    it('should render the company logo if the offer is missing an image', async () => {
      const offerImage = await screen.findByAltText(testDataV5[1].OfferName);
      expect(offerImage).toHaveAttribute(
        'src',
        expect.stringContaining(
          'https%3A%2F%2Fcdn.bluelightcard.co.uk%2Fcompanyimages%2Fcomplarge%2Fretina%2F1.jpg',
        ),
      );
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
        <QueryClientProvider client={new QueryClient()}>
          <PlatformAdapterProvider adapter={platformAdapter}>
            <RouterContext.Provider value={mockRouter as NextRouter}>
              <JotaiTestProvider
                initialValues={[
                  [experimentsAndFeatureFlags, featureFlags],
                  [
                    userProfile,
                    { service: 'test-organisation', isAgeGated: true, dob: '1990-01-01' },
                  ],
                ]}
              >
                <WithSpinner>
                  <SearchResultsPage />
                </WithSpinner>
              </JotaiTestProvider>
            </RouterContext.Provider>
          </PlatformAdapterProvider>
        </QueryClientProvider>,
      ),
    );
  };
});
