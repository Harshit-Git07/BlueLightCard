import { FC, PropsWithChildren } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import Spinner from '@/modules/Spinner';
import eventBus from '@/eventBus';
import { APIUrl, Channels } from '@/globals';
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

jest.mock('@/invoke/apiCall');
jest.mock('@/invoke/analytics');

describe('Search results', () => {
  let bus = eventBus();
  const searchTermValue = 'pizza';
  let analyticsMock: jest.SpyInstance<void, [properties: NativeAnalytics.Parameters], any>;
  let user: UserEvent;

  let testData: OfferListItemModel[];

  afterEach(() => {
    bus.clearMessages(Channels.API_RESPONSE);
  });

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

      whenTheSearchResultsPageIsRendered(searchTermValue);

      const spinner = screen.queryByRole('progressbar');
      expect(spinner).toBeFalsy();
    });
  });

  describe('render results', () => {
    it('should render list of results', () => {
      givenSearchResultsAreReturnedFromTheAPI();

      whenTheSearchResultsPageIsRendered(searchTermValue);

      const results = screen.getAllByRole('listitem');
      expect(results).toHaveLength(2);
    });
    it('should show no results found when nothing found', () => {
      givenSearchResultsAreReturnedFromTheAPI([]);

      whenTheSearchResultsPageIsRendered(searchTermValue);

      const results = screen.queryByText('No results found.');
      expect(results).toBeInTheDocument();
    });
    it('should show no results found when nothing found but a previous search was successful', () => {
      givenSearchResultsAreReturnedFromTheAPI([]);

      whenTheSearchResultsPageIsRendered(searchTermValue, [buildSearchResult()]);

      const results = screen.queryByText('No results found.');
      expect(results).toBeInTheDocument();
    });
  });

  describe('request data', () => {
    it('should request data when search term is set', async () => {
      const requestDataMock = jest
        .spyOn(InvokeNativeAPICall.prototype, 'requestData')
        .mockImplementation(() => jest.fn());
      givenSearchResultsAreReturnedFromTheAPI();

      whenTheSearchResultsPageIsRendered(searchTermValue);

      expect(requestDataMock).toHaveBeenCalledTimes(1);
      expect(requestDataMock).toHaveBeenCalledWith(APIUrl.Search, { term: searchTermValue });
    });
  });

  describe('log analytics events', () => {
    it('should log analytics event on results returned', () => {
      givenSearchResultsAreReturnedFromTheAPI();
      whenTheSearchResultsPageIsRendered(searchTermValue);

      expect(analyticsMock).toHaveBeenCalledWith({
        event: AmplitudeEvents.SEARCH_RESULTS_LIST_VIEWED,
        parameters: {
          search_term: searchTermValue,
          number_of_results: 2,
        },
      });
    });
    it('should log analytics event when list item is clicked', async () => {
      givenSearchResultsAreReturnedFromTheAPI();
      whenTheSearchResultsPageIsRendered(searchTermValue);

      const listItems = screen.getAllByRole('button');

      await user.click(listItems[1]);

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
    bus.broadcast(Channels.API_RESPONSE, {
      url: `${APIUrl.Search}?term=nike`,
      response: {
        data,
      },
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

  const whenTheSearchResultsPageIsRendered = (
    term: string = '',
    existingSearchResults: SearchResults = [],
  ) => {
    render(
      <JotaiTestProvider
        initialValues={[
          [searchTerm, term],
          [searchResults, existingSearchResults],
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
