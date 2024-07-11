import { FC, PropsWithChildren } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import Spinner from '@/modules/Spinner';
import { APIUrl, V5_API_URL } from '@/globals';
import InvokeNativeAnalytics from '@/invoke/analytics';
import InvokeNativeAPICall from '@/invoke/apiCall';
import { AmplitudeEvents } from '@/utils/amplitude/amplitudeEvents';
import { JotaiTestProvider } from '@/utils/jotaiTestProvider';
import { searchResults, searchTerm } from '@/modules/SearchResults/store';
import SearchResultsContainer from '@/modules/SearchResults/components/SearchResultsContainer';
import { OfferListItemModel } from '@/models/offer';
import { offerListItemFactory, searchResultV5Factory } from '@/modules/List/__mocks__/factory';
import '@testing-library/jest-dom';
import { SearchResults, SearchResultsV5 } from '@/modules/SearchResults/types';
import { experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';
import { Experiments, FeatureFlags } from '@/components/AmplitudeProvider/amplitudeKeys';
import { PlatformAdapterProvider, useMockPlatformAdapter } from '@bluelightcard/shared-ui';
import { userProfile } from '@/components/UserProfileProvider/store';
import useAPI from '@/hooks/useAPI';

jest.mock('@/invoke/apiCall');
jest.mock('@/invoke/analytics');
jest.mock('@/hooks/useAPI');

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

let testData: OfferListItemModel[];
let testDataV5: SearchResultsV5;

describe('Search results', () => {
  const searchTermValue = 'pizza';
  let analyticsMock: jest.SpyInstance<void, [properties: NativeAnalytics.Parameters], any>;
  let user: UserEvent;
  let useAPIMock: jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();
    analyticsMock = jest
      .spyOn(InvokeNativeAnalytics.prototype, 'logAnalyticsEvent')
      .mockImplementation(() => jest.fn());
    useAPIMock = jest.mocked(useAPI);
    user = userEvent.setup();
    testData = offerListItemFactory.buildList(2);
    testData[1].companyname = 'Test Company';
    testData[1].offername = 'Test Offer';
    testDataV5 = searchResultV5Factory.buildList(2);
    testDataV5[1].CompanyName = 'Test Company';
    testDataV5[1].OfferName = 'Test Offer';
  });

  describe('spinner', () => {
    it('should hide spinner on receiving api response', () => {
      givenSearchResultsAreReturnedFromTheAPI();

      whenSearchResultsPageIsRendered(searchTermValue);

      const spinner = screen.queryByRole('progressbar');
      expect(spinner).toBeFalsy();
    });
    it('should hide spinner on receiving api response when category level three search experiment is on', async () => {
      const mockPlatformAdapter = useGivenSearchResultsAreReturnedFromTheAPI();

      whenSearchResultsPageIsRendered(searchTermValue, [], 'treatment', mockPlatformAdapter, 'on');

      await waitFor(() => {
        const spinner = screen.queryByRole('progressbar');
        expect(spinner).toBeFalsy();
      });
    });
  });

  describe('render results', () => {
    it('should render list of results', async () => {
      givenSearchResultsAreReturnedFromTheAPI();

      whenSearchResultsPageIsRendered(searchTermValue);

      const results = await screen.findAllByRole('listitem');
      expect(results).toHaveLength(2);
    });
    it('should render list of results when category level three search experiment is on', async () => {
      const mockPlatformAdapter = useGivenSearchResultsAreReturnedFromTheAPI();

      whenSearchResultsPageIsRendered(searchTermValue, [], 'treatment', mockPlatformAdapter, 'on');

      const results = await screen.findAllByRole('listitem');
      expect(results).toHaveLength(2);
    });
    it('should show no results found when nothing found', async () => {
      whenSearchResultsPageIsRendered(searchTermValue);

      givenSearchResultsAreReturnedFromTheAPI([]);

      await screen.findByText('No results found.');
    });
    it('should show no results found when nothing found and category level three search experiment is on', async () => {
      const mockPlatformAdapter = useGivenSearchResultsAreReturnedFromTheAPI([]);

      whenSearchResultsPageIsRendered(searchTermValue, [], 'treatment', mockPlatformAdapter);

      await screen.findByText('No results found.');
    });
    it('should show no results found when nothing found but a previous search was successful', async () => {
      whenSearchResultsPageIsRendered(searchTermValue, testData);

      givenSearchResultsAreReturnedFromTheAPI([]);

      await screen.findByText('No results found.');
    });
    it('should show no results found when nothing found but a previous search was successful and category level three search experiment is on', async () => {
      const mockPlatformAdapter = useGivenSearchResultsAreReturnedFromTheAPI([]);

      whenSearchResultsPageIsRendered(searchTermValue, testData, 'treatment', mockPlatformAdapter);

      await screen.findByText('No results found.');
    });
  });

  describe('request data', () => {
    it('should request data when search term is set', async () => {
      const requestDataMock = jest
        .spyOn(InvokeNativeAPICall.prototype, 'requestData')
        .mockImplementation(() => jest.fn());
      givenSearchResultsAreReturnedFromTheAPI();

      whenSearchResultsPageIsRendered(searchTermValue);

      expect(requestDataMock).toHaveBeenCalledTimes(1);
      expect(requestDataMock).toHaveBeenCalledWith(APIUrl.Search, { term: searchTermValue });
    });
    it('should request data from experimental search API when search term is set', async () => {
      const mockPlatformAdapter = useGivenSearchResultsAreReturnedFromTheAPI();

      whenSearchResultsPageIsRendered(searchTermValue, [], 'treatment', mockPlatformAdapter, 'on');

      await waitFor(() => {
        expect(mockPlatformAdapter.invokeV5Api).toHaveBeenCalledTimes(1);
        expect(mockPlatformAdapter.invokeV5Api).toHaveBeenCalledWith(V5_API_URL.Search, {
          method: 'GET',
          queryParameters: {
            query: searchTermValue,
            organisation: 'DEN',
            isAgeGated: 'false',
          },
          cachePolicy: 'auto',
        });
      });
    });
    it('should request data from v4 endpoint when search experiment is on but v5 integration is off', async () => {
      const requestDataMock = jest
        .spyOn(InvokeNativeAPICall.prototype, 'requestData')
        .mockImplementation(() => jest.fn());
      givenSearchResultsAreReturnedFromTheAPI();

      whenSearchResultsPageIsRendered(searchTermValue, [], 'treatment', mockPlatformAdapter, 'off');

      expect(requestDataMock).toHaveBeenCalledTimes(1);
      expect(requestDataMock).toHaveBeenCalledWith(APIUrl.Search, { term: searchTermValue });
    });
  });

  describe('log analytics events', () => {
    it('should log analytics event on results returned', async () => {
      givenSearchResultsAreReturnedFromTheAPI();

      whenSearchResultsPageIsRendered(searchTermValue);

      await waitFor(() =>
        expect(analyticsMock).toHaveBeenCalledWith({
          event: AmplitudeEvents.SEARCH_RESULTS_LIST_VIEWED,
          parameters: {
            search_term: searchTermValue,
            number_of_results: 2,
          },
        }),
      );
    });
    it('should log analytics event on results returned when category level three search experiment is on', async () => {
      const mockPlatformAdapter = useGivenSearchResultsAreReturnedFromTheAPI();

      whenSearchResultsPageIsRendered(searchTermValue, [], 'treatment', mockPlatformAdapter, 'on');

      await waitFor(() =>
        expect(analyticsMock).toHaveBeenCalledWith({
          event: AmplitudeEvents.SEARCH_RESULTS_LIST_VIEWED,
          parameters: {
            search_term: searchTermValue,
            number_of_results: 2,
          },
        }),
      );
    });
    it('should log analytics event when list item is clicked', async () => {
      givenSearchResultsAreReturnedFromTheAPI();

      whenSearchResultsPageIsRendered(searchTermValue);

      const listItems = await screen.findAllByRole('button');

      act(() => {
        fireEvent.click(listItems[1]);
      });

      expect(analyticsMock.mock.calls[1][0]).toEqual({
        event: AmplitudeEvents.SEARCH_RESULTS_LIST_CLICKED,
        parameters: {
          search_term: searchTermValue,
          number_of_results: 2,
          company_id: testData[1].compid,
          company_name: testData[1].companyname,
          offer_id: testData[1].id,
          offer_name: testData[1].offername,
          search_result_number: 2,
        },
      });
    });
  });

  const givenSearchResultsAreReturnedFromTheAPI = (data: OfferListItemModel[] = testData) => {
    useAPIMock.mockReturnValue({
      data,
    });
  };

  const useGivenSearchResultsAreReturnedFromTheAPI = (data: SearchResultsV5 = testDataV5) => {
    return useMockPlatformAdapter(200, {
      data,
    });
  };

  const WithSpinner: FC<PropsWithChildren> = ({ children }) => {
    return (
      <div>
        {children}
        <Spinner />
      </div>
    );
  };

  const whenSearchResultsPageIsRendered = (
    term: string = '',
    existingSearchResults: SearchResults = [],
    categoryLevelThreeSearchExperiment = 'control',
    platformAdapter = mockPlatformAdapter,
    v5EndpointsFlag = 'off',
  ) => {
    return render(
      <PlatformAdapterProvider adapter={platformAdapter}>
        <JotaiTestProvider
          initialValues={[
            [searchTerm, term],
            [searchResults, { results: existingSearchResults, term: undefined }],
            [
              experimentsAndFeatureFlags,
              {
                [Experiments.CATEGORY_LEVEL_THREE_SEARCH]: categoryLevelThreeSearchExperiment,
                [FeatureFlags.V5_API_INTEGRATION]: v5EndpointsFlag,
              },
            ],
            [userProfile, { service: 'DEN' }],
          ]}
        >
          <WithSpinner>
            <SearchResultsContainer />
          </WithSpinner>
        </JotaiTestProvider>
      </PlatformAdapterProvider>,
    );
  };

  const mockPlatformAdapter = useMockPlatformAdapter();
});
