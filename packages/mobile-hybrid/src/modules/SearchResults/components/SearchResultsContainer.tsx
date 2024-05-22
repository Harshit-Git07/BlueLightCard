import { FC, useCallback, useEffect } from 'react';
import { useAtomValue, useAtom, useSetAtom } from 'jotai';
import { PlatformVariant, useOfferDetails } from '@bluelightcard/shared-ui';
import { APIUrl, V5_API_URL } from '@/globals';
import InvokeNativeAPICall from '@/invoke/apiCall';
import SearchResultsPresenter from './SearchResultsPresenter';
import { searchResults, searchTerm } from '../store';
import { OfferListItem, SearchResults } from '../types';
import { spinner } from '@/modules/Spinner/store';
import useAPI, { APIResponse } from '@/hooks/useAPI';
import InvokeNativeAnalytics from '@/invoke/analytics';
import { AmplitudeEvents } from '@/utils/amplitude/amplitudeEvents';
import { Experiments } from '@/components/AmplitudeProvider/amplitudeKeys';
import { experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';
import { userService } from '@/components/UserServiceProvider/store';

const analytics = new InvokeNativeAnalytics();
const request = new InvokeNativeAPICall();

/**
 * Container requests the search results by using the stored term and listens for the response, setting the results in the store
 */
const SearchResultsContainer: FC = () => {
  const { viewOffer } = useOfferDetails();
  const [results, setResults] = useAtom(searchResults);
  const term = useAtomValue(searchTerm);
  const setSpinner = useSetAtom(spinner);
  const amplitudeExperiment = useAtomValue(experimentsAndFeatureFlags);
  const userServiceValue = useAtomValue(userService);

  const categoryTreeExperimentEnabled =
    amplitudeExperiment[Experiments.CATEGORY_LEVEL_THREE_SEARCH] === 'treatment';
  const searchResultsApi = categoryTreeExperimentEnabled ? V5_API_URL.Search : APIUrl.Search;
  const searchResultsData = useAPI(searchResultsApi) as APIResponse<SearchResults>;

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

  const onOfferClick = async ({
    companyName,
    companyId,
    offerId,
    offerName,
    searchResultNumber,
  }: OfferListItem) => {
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

    await viewOffer({
      offerId,
      companyId,
      companyName,
      platform: PlatformVariant.MobileHybrid,
    });
  };

  useEffect(() => {
    if (term) {
      if (categoryTreeExperimentEnabled) {
        request.requestDataV5(searchResultsApi, {
          method: 'GET',
          queryParameters: { query: term, organisation: userServiceValue ?? '' },
          cachePolicy: 'auto',
        });
      } else {
        request.requestData(searchResultsApi, { term });
      }
    }
  }, [term, searchResultsApi, categoryTreeExperimentEnabled, userServiceValue]);

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
