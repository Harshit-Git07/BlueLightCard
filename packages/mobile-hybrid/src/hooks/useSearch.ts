import { atom, useAtom } from 'jotai';
import { APIUrl, CDN_URL, V5_API_URL } from '@/globals';
import { Experiments } from '@/components/AmplitudeProvider/amplitudeKeys';
import { IPlatformAdapter } from '../../../shared-ui/src/adapters';
import InvokeNativeAPICall from '@/invoke/apiCall';

export interface SearchResult {
  id: number;
  catid?: number;
  compid: number;
  typeid: number;
  offername: string;
  companyname: string;
  logos: string;
  absoluteLogos: string;
  s3logos: string;
}

export interface SearchResultV5 {
  ID: number;
  CatID: number;
  CompID: number;
  TypeID: number;
  OfferName: string;
  CompanyName: string;
  Logos: string;
  AbsoluteLogos: string;
  S3Logos: string;
}

export interface SearchResultResponse {
  success: boolean;
  data: SearchResult[];
}

export enum Status {
  Empty = 'EMPTY',
  Loading = 'LOADING',
  Error = 'ERROR',
  Success = 'SUCCESS',
}

const initialState = {
  status: Status.Empty,
  searchTerm: undefined,
  searchResults: [],
};

export const statusAtom = atom<Status>(initialState.status);
export const searchTermAtom = atom<string | undefined>(initialState.searchTerm);
export const searchResultsAtom = atom<SearchResult[]>(initialState.searchResults);

const invokeNativeApiCall = new InvokeNativeAPICall();

const mapV5SearchResults = (searchResults: SearchResultV5[]) => {
  return searchResults.map((offer) => ({
    id: offer.ID,
    offername: offer.OfferName,
    companyname: offer.CompanyName,
    compid: offer.CompID,
    s3logos: getSearchResultLogo(offer),
    logos: offer.S3Logos,
    absoluteLogos: offer.S3Logos,
    typeid: offer.TypeID,
  }));
};

const getSearchResultLogo = (searchResult: SearchResultV5) => {
  if (searchResult.S3Logos && searchResult.S3Logos !== '') {
    return searchResult.S3Logos;
  } else {
    return `${CDN_URL}/companyimages/complarge/retina/${searchResult.CompID}.jpg`;
  }
};

const useSearch = (platformAdapter: IPlatformAdapter) => {
  const [status, setStatus] = useAtom(statusAtom);
  const [searchTerm, setSearchTerm] = useAtom(searchTermAtom);
  const [searchResults, setSearchResults] = useAtom(searchResultsAtom);

  const withSearchV5Experiment =
    platformAdapter.getAmplitudeFeatureFlag(Experiments.SEARCH_V5) === 'treatment';

  const doSearch = async (term: string) => {
    setSearchTerm(term);
    setStatus(Status.Loading);
    setSearchResults([]);

    try {
      const results = await invokeNativeApiCall.requestDataAsync<SearchResultResponse>(
        APIUrl.Search,
        { term },
      );

      if (!results?.success) {
        throw new Error('Error in search results response');
      }

      setSearchResults(results.data);
      setStatus(Status.Success);
    } catch (err) {
      console.error('Error requesting V4 search results', err);
      setStatus(Status.Error);
    }
  };

  const doSearchWithSearchV5Experiment = async (
    term: string,
    organisation: string = '',
    isAgeGated: boolean = false,
  ) => {
    setSearchTerm(term);
    setStatus(Status.Loading);
    setSearchResults([]);

    try {
      const results = await platformAdapter.invokeV5Api(V5_API_URL.Search, {
        method: 'GET',
        queryParameters: {
          query: term,
          organisation,
          isAgeGated: isAgeGated ? 'true' : 'false',
        },
        cachePolicy: 'auto',
      });

      const parsedSearchResults = JSON.parse(results.data).data;
      const mappedSearchResults = mapV5SearchResults(parsedSearchResults);
      setSearchResults(mappedSearchResults);
      setStatus(Status.Success);
    } catch (err) {
      console.error('Error requesting V5 search results, falling back to V4', err);
      await doSearch(term);
    }
  };

  const resetSearch = () => {
    setSearchTerm(initialState.searchTerm);
    setStatus(initialState.status);
    setSearchResults(initialState.searchResults);
  };

  return {
    status,
    searchTerm,
    searchResults,
    doSearch: withSearchV5Experiment ? doSearchWithSearchV5Experiment : doSearch,
    resetSearch,
  };
};

export default useSearch;
