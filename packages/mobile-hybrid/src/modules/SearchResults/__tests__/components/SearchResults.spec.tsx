import { FC, PropsWithChildren } from 'react';
import { render, screen } from '@testing-library/react';
import Spinner from '@/modules/Spinner';
import eventBus from '@/eventBus';
import { APIUrl, Channels } from '@/globals';
import { SearchResults } from '../../types';
import InvokeNativeAnalytics from '@/invoke/analytics';
import InvokeNativeAPICall from '@/invoke/apiCall';
import { AmplitudeEvents } from '@/utils/amplitude/amplitudeEvents';
import { JotaiTestProvider } from '@/utils/jotaiTestProvider';
import { searchTerm } from '@/modules/SearchResults/store';
import SearchResultsContainer from '@/modules/SearchResults/components/SearchResultsContainer';

jest.mock('@/invoke/apiCall');
jest.mock('@/invoke/analytics');

describe('Search results', () => {
  let bus = eventBus();
  const searchTermValue = 'pizza';

  afterEach(() => {
    bus.clearMessages(Channels.API_RESPONSE);
  });

  beforeEach(() => {
    jest.resetAllMocks();
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
      const analyticsMock = jest
        .spyOn(InvokeNativeAnalytics.prototype, 'logAnalyticsEvent')
        .mockImplementation(() => jest.fn());
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
  });

  const givenSearchResultsAreReturnedFromTheAPI = () => {
    bus.broadcast(Channels.API_RESPONSE, {
      url: `${APIUrl.Search}?term=nike`,
      response: {
        data: [
          { id: 123, companyname: '', offername: '', s3logos: '' },
          { id: 124, companyname: '', offername: '', s3logos: '' },
        ] as SearchResults,
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

  const whenTheSearchResultsPageIsRendered = (term: string = '') => {
    render(
      <JotaiTestProvider initialValues={[[searchTerm, term]]}>
        <WithSpinner>
          <SearchResultsContainer />
        </WithSpinner>
      </JotaiTestProvider>,
    );
  };
});
