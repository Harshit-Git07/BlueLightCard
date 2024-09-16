import { FC, useCallback, useEffect } from 'react';
import { PlatformVariant, useOfferDetails, usePlatformAdapter } from '@bluelightcard/shared-ui';
import SearchResultsPresenter from './SearchResultsPresenter';
import { OfferListItem } from '../types';
import InvokeNativeAnalytics from '@/invoke/analytics';
import { AmplitudeEvents } from '@/utils/amplitude/amplitudeEvents';
import useSearch from '@/hooks/useSearch';

const analytics = new InvokeNativeAnalytics();

/**
 * Container requests the search results by using the stored term and listens for the response, setting the results in the store
 */
const SearchResultsContainer: FC = () => {
  const platformAdapter = usePlatformAdapter();
  const { searchTerm, searchResults } = useSearch(platformAdapter);

  const { viewOffer } = useOfferDetails();

  const logSearchResultsListViewedAnalytic = useCallback(
    (numberOfResults: number) => {
      analytics.logAnalyticsEvent({
        event: AmplitudeEvents.SEARCH_RESULTS_LIST_VIEWED,
        parameters: {
          search_term: searchTerm,
          number_of_results: numberOfResults,
        },
      });
    },
    [searchTerm],
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
        number_of_results: searchResults.length,
        search_term: searchTerm,
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
    if (searchResults && searchResults.length > 0) {
      logSearchResultsListViewedAnalytic(searchResults.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, searchResults]);

  return <SearchResultsPresenter results={searchResults} onOfferClick={onOfferClick} />;
};

export default SearchResultsContainer;
