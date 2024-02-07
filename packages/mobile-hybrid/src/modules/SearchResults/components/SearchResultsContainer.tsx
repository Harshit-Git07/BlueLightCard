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
import { off } from 'process';

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

  const onOfferClick = useCallback<Props['onOfferClick']>((companyId, offerId) => {
    navigation.navigate(`/offerdetails.php?cid=${companyId}&oid=${offerId}`, 'search');
  }, []);
  // initiate request if search term defined
  useEffect(() => {
    if (term) {
      setSpinner(true);
      request.requestData(APIUrl.Search, term);
      console.log('search term', term);
    }
  }, [term, setSpinner]);

  // set results into store
  useEffect(() => {
    if (searchResultsData?.data) {
      setResults(searchResultsData.data);
      setSpinner(false);
    }
    console.info(searchResultsData);
  }, [searchResultsData]);

  return <SearchResultsPresenter results={results} onOfferClick={onOfferClick} />;
};

export default SearchResultsContainer;
