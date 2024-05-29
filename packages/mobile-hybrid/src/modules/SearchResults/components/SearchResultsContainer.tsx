import { FC, useCallback, useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { PlatformVariant, useOfferDetails } from '@bluelightcard/shared-ui';
import SearchResultsPresenter from './SearchResultsPresenter';
import { searchResults, searchTerm } from '../store';
import { OfferListItem } from '../types';
import { spinner } from '@/modules/Spinner/store';
import InvokeNativeAnalytics from '@/invoke/analytics';
import { AmplitudeEvents } from '@/utils/amplitude/amplitudeEvents';
import useSearchResults from '@/hooks/useSearchResults';

const analytics = new InvokeNativeAnalytics();

/**
 * Container requests the search results by using the stored term and listens for the response, setting the results in the store
 */
const SearchResultsContainer: FC = () => {
  const { viewOffer } = useOfferDetails();
  const resultsWrapper = useAtomValue(searchResults);
  const term = useAtomValue(searchTerm);
  const setSpinner = useSetAtom(spinner);

  useSearchResults(term);

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
        number_of_results: resultsWrapper.results.length,
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
    if (resultsWrapper && resultsWrapper.results.length > 0) {
      logSearchResultsListViewedAnalytic(resultsWrapper.results.length);
    }
    setSpinner(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultsWrapper.term, resultsWrapper.results, setSpinner]);

  return <SearchResultsPresenter results={resultsWrapper.results} onOfferClick={onOfferClick} />;
};

export default SearchResultsContainer;
