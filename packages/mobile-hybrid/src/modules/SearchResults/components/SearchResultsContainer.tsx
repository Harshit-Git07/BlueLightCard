import { FC, useCallback, useEffect } from 'react';
import { useAtomValue, useAtom, useSetAtom } from 'jotai';
import { APIUrl } from '@/globals';
import InvokeNativeAPICall from '@/invoke/apiCall';
import SearchResultsPresenter, { Props } from './SearchResultsPresenter';
import { searchResults, searchTerm } from '../store';
import { SearchResults } from '../types';
import { spinner } from '@/modules/Spinner/store';
import useAPI from '@/hooks/useAPI';
import InvokeNativeNavigation from '@/invoke/navigation';
import InvokeNativeAnalytics from '@/invoke/analytics';
import { AmplitudeEvents } from '@/utils/amplitude/amplitudeEvents';

const analytics = new InvokeNativeAnalytics();
const request = new InvokeNativeAPICall();
const navigation = new InvokeNativeNavigation();

/**
 * Container requests the search results by using the stored term and listens for the response, setting the results in the store
 */
const SearchResultsContainer: FC = () => {
  const [results, setResults] = useAtom(searchResults);
  const term = useAtomValue(searchTerm);
  const setSpinner = useSetAtom(spinner);

  const { response: searchResultsData } = useAPI<{ data: SearchResults }>(APIUrl.Search);

  const logSearchResultsListViewedAnalytic = useCallback(
    (numberOfResults: number) => {
      analytics.logAnalyticsEvent({
        event: AmplitudeEvents.SEARCH_RESULTS_LIST_VIEWED,
        parameters: {
          search_term: term,
          number_of_results: numberOfResults,
        },
      });
    },
    [term],
  );

  const onOfferClick = useCallback<Props['onOfferClick']>((companyId, offerId) => {
    navigation.navigate(`/offerdetails.php?cid=${companyId}&oid=${offerId}`, 'search');
  }, []);

  useEffect(() => {
    if (term) {
      request.requestData(APIUrl.Search, { term });
    }
  }, [term]);

  // set results into store
  useEffect(() => {
    if (searchResultsData?.data) {
      setResults(searchResultsData.data);
      logSearchResultsListViewedAnalytic(searchResultsData.data.length);
    }
    setSpinner(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchResultsData, setResults, setSpinner]);

  return <SearchResultsPresenter results={results} onOfferClick={onOfferClick} />;
};

export default SearchResultsContainer;
