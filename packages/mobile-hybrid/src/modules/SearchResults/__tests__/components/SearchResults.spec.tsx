import { FC, PropsWithChildren } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import Spinner from '@/modules/Spinner';
import bus from '@/eventBus';
import { APIUrl, Channels, V5_API_URL } from '@/globals';
import InvokeNativeAnalytics from '@/invoke/analytics';
import InvokeNativeAPICall from '@/invoke/apiCall';
import { AmplitudeEvents } from '@/utils/amplitude/amplitudeEvents';
import { JotaiTestProvider } from '@/utils/jotaiTestProvider';
import { searchResults, searchTerm } from '@/modules/SearchResults/store';
import SearchResultsContainer from '@/modules/SearchResults/components/SearchResultsContainer';
import { OfferListItemModel } from '@/models/offer';
import { offerListItemFactory } from '@/modules/List/__mocks__/factory';
import '@testing-library/jest-dom';
import { SearchResult, SearchResults } from '@/modules/SearchResults/types';
import { experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';
import { Experiments } from '@/components/AmplitudeProvider/amplitudeKeys';

jest.mock('@/invoke/apiCall');
jest.mock('@/invoke/analytics');

describe('Search results', () => {
  const searchTermValue = 'pizza';
  let analyticsMock: jest.SpyInstance<void, [properties: NativeAnalytics.Parameters], any>;
  let user: UserEvent;

  let testData: OfferListItemModel[];

  beforeEach(() => {
    jest.resetAllMocks();
    analyticsMock = jest
      .spyOn(InvokeNativeAnalytics.prototype, 'logAnalyticsEvent')
      .mockImplementation(() => jest.fn());
    user = userEvent.setup();
    testData = offerListItemFactory.buildList(2);
    testData[1].companyname = 'Test Company';
    testData[1].offername = 'Test Offer';
  });

  describe('spinner', () => {
    it('should hide spinner on receiving api response', () => {
      givenSearchResultsAreReturnedFromTheAPI();

      whenSearchResultsPageIsRendered(searchTermValue);

      const spinner = screen.queryByRole('progressbar');
      expect(spinner).toBeFalsy();
    });
  });

  describe('render results', () => {
    it('should render list of results', async () => {
      whenSearchResultsPageIsRendered(searchTermValue);

      givenSearchResultsAreReturnedFromTheAPI();

      const results = await screen.findAllByRole('listitem');
      expect(results).toHaveLength(2);
    });
    it('should render list of results when category level three search experiment is on', async () => {
      whenSearchResultsPageIsRendered(searchTermValue, [], 'treatment');

      givenSearchResultsAreReturnedFromV5API();

      const results = await screen.findAllByRole('listitem');
      expect(results).toHaveLength(2);
    });
    it('should show no results found when nothing found', async () => {
      whenSearchResultsPageIsRendered(searchTermValue);

      givenSearchResultsAreReturnedFromTheAPI([]);

      await screen.findByText('No results found.');
    });
    it('should show no results found when nothing found but a previous search was successful', async () => {
      whenSearchResultsPageIsRendered(searchTermValue, [buildSearchResult()]);

      givenSearchResultsAreReturnedFromTheAPI([]);

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
      const requestDataMock = jest
        .spyOn(InvokeNativeAPICall.prototype, 'requestDataV5')
        .mockImplementation(() => jest.fn());
      givenSearchResultsAreReturnedFromV5API();

      whenSearchResultsPageIsRendered(searchTermValue, [], 'treatment');

      expect(requestDataMock).toHaveBeenCalledTimes(1);
      expect(requestDataMock).toHaveBeenCalledWith(V5_API_URL.Search, {
        method: 'GET',
        queryParameters: { query: searchTermValue, organisation: '' },
        cachePolicy: 'auto',
      });
    });
  });

  describe('log analytics events', () => {
    it('should log analytics event on results returned', async () => {
      whenSearchResultsPageIsRendered(searchTermValue);

      givenSearchResultsAreReturnedFromTheAPI();

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
      whenSearchResultsPageIsRendered(searchTermValue);

      givenSearchResultsAreReturnedFromTheAPI();

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
    act(() => {
      bus.emit(Channels.API_RESPONSE, APIUrl.Search, {
        data,
      });
    });
  };

  const givenSearchResultsAreReturnedFromV5API = (data: OfferListItemModel[] = testData) => {
    act(() => {
      bus.emit(Channels.API_RESPONSE, V5_API_URL.Search, {
        data,
      });
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
  ) => {
    return render(
      <JotaiTestProvider
        initialValues={[
          [searchTerm, term],
          [searchResults, existingSearchResults],
          [
            experimentsAndFeatureFlags,
            { [Experiments.CATEGORY_LEVEL_THREE_SEARCH]: categoryLevelThreeSearchExperiment },
          ],
        ]}
      >
        <WithSpinner>
          <SearchResultsContainer />
        </WithSpinner>
      </JotaiTestProvider>,
    );
  };

  const buildSearchResult = (): SearchResult => {
    return {
      id: 123,
      catid: 123,
      compid: 123,
      typeid: 5,
      offername: 'Offer 1',
      companyname: 'Company 1',
      logos: '',
      absoluteLogos: '',
      s3logos: '',
    };
  };
});
