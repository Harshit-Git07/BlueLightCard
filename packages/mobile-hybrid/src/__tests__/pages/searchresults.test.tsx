import SearchResultsPage from '@/pages/searchresults';
import { render, screen, waitFor } from '@testing-library/react';
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

jest.mock('@/invoke/apiCall');
jest.mock('@/invoke/analytics');

const searchValue = 'test';
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

describe('Search Results', () => {
  const mockPlatformAdapter = useMockPlatformAdapter();

  describe('Feature Flags', () => {
    it('should show browse categories when feature enabled', () => {
      whenPageIsRenderedWithFlags({ [FeatureFlags.SEARCH_RESULTS_PAGE_CATEGORIES_LINKS]: 'on' });

      expect(screen.queryByText('Browse Categories')).toBeInTheDocument();
    });

    it('should not show browse categories when feature disabled', () => {
      whenPageIsRenderedWithFlags({ [FeatureFlags.SEARCH_RESULTS_PAGE_CATEGORIES_LINKS]: 'off' });

      expect(screen.queryByText('Browse Categories')).not.toBeInTheDocument();
    });

    it('should not show browse categories when feature flag not found', () => {
      whenPageIsRenderedWithFlags({});

      expect(screen.queryByText('Browse Categories')).not.toBeInTheDocument();
    });
  });

  describe('Search query params', () => {
    it('should set the search term from the query params', async () => {
      const requestMock = jest
        .spyOn(InvokeNativeAPICall.prototype, 'requestData')
        .mockImplementation(() => jest.fn());

      whenPageIsRenderedWithFlags({ [Experiments.CATEGORY_LEVEL_THREE_SEARCH]: 'control' });

      expect(requestMock).toHaveBeenCalledWith(APIUrl.Search, {
        term: searchValue,
      });
    });

    it('should set the search term from the query params when level three search experiment is on ', async () => {
      const mockPlatformAdapter = useMockPlatformAdapter(200, {
        data: testDataV5,
      });

      whenPageIsRenderedWithFlags(
        {
          [Experiments.CATEGORY_LEVEL_THREE_SEARCH]: 'treatment',
          [FeatureFlags.V5_API_INTEGRATION]: 'on',
        },
        mockPlatformAdapter,
      );

      await waitFor(() => {
        expect(mockPlatformAdapter.invokeV5Api).toHaveBeenCalledTimes(1);
        expect(mockPlatformAdapter.invokeV5Api).toHaveBeenCalledWith(V5_API_URL.Search, {
          method: 'GET',
          queryParameters: {
            query: searchValue,
            organisation: '',
            isAgeGated: 'false',
          },
          cachePolicy: 'auto',
        });
      });
    });

    it('should show the spinner when search is made', async () => {
      whenPageIsRenderedWithFlags({ [Experiments.CATEGORY_LEVEL_THREE_SEARCH]: 'control' });

      const spinner = screen.queryByRole('progressbar');
      expect(spinner).toBeTruthy();
    });

    it('should show the spinner when search is made with level three experiment on', async () => {
      const mockPlatformAdapter = useMockPlatformAdapter(200, {
        data: testDataV5,
      });

      whenPageIsRenderedWithFlags(
        { [Experiments.CATEGORY_LEVEL_THREE_SEARCH]: 'treatment' },
        mockPlatformAdapter,
      );

      await waitFor(() => {
        const spinner = screen.queryByRole('progressbar');
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

  const whenPageIsRenderedWithFlags = (
    featureFlags: any,
    platformAdapter = mockPlatformAdapter,
  ) => {
    render(
      <PlatformAdapterProvider adapter={platformAdapter}>
        <RouterContext.Provider value={mockRouter as NextRouter}>
          <JotaiTestProvider initialValues={[[experimentsAndFeatureFlags, featureFlags]]}>
            <WithSpinner>
              <SearchResultsPage />
            </WithSpinner>
          </JotaiTestProvider>
        </RouterContext.Provider>
      </PlatformAdapterProvider>,
    );
  };
});
