import { FC, useCallback, useEffect } from 'react';
import { useAtomValue, useAtom, useSetAtom } from 'jotai';
import { APIUrl } from '@/globals';
import InvokeNativeAPICall from '@/invoke/apiCall';
import SearchResultsPresenter, { Props } from './SearchResultsPresenter';
import { searchResults, searchTerm } from '../store';
import { OfferListItem, SearchResults } from '../types';
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

  const onOfferClick = ({
    companyName,
    companyId,
    offerId,
    offerName,
    searchResultNumber,
  }: OfferListItem) => {
    navigation.navigate(`/offerdetails.php?cid=${companyId}&oid=${offerId}`, 'search');
    analytics.logAnalyticsEvent({
      event: AmplitudeEvents.SEARCH_RESULTS_LIST_CLICKED,
      parameters: {
        company_id: companyId,
        company_name: companyName,
        offer_id: offerId,
        offer_name: offerName,
        number_of_results: results.length,
        search_term: term,
        search_result_number: searchResultNumber,
      },
    });
  };
  useEffect(() => {
    if (term) {
      request.requestData(APIUrl.Search, { term });
    }
  }, [term]);

  // set results into store
  useEffect(() => {
    if (searchResultsData?.data && searchResultsData.data.length > 0) {
      setResults(searchResultsData.data);
      logSearchResultsListViewedAnalytic(searchResultsData.data.length);
    } else {
      setResults([]);
    }
    setSpinner(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchResultsData, setResults, setSpinner]);

  return <SearchResultsPresenter results={results} onOfferClick={onOfferClick} />;
};

export default SearchResultsContainer;
