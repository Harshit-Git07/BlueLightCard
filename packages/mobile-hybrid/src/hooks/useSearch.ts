import { atom, useAtom } from 'jotai';
import { APIUrl, V5_API_URL } from '@/globals';
import { FeatureFlags } from '@/components/AmplitudeProvider/amplitudeKeys';
import { darkRead, IPlatformAdapter } from '@bluelightcard/shared-ui';
import InvokeNativeAPICall from '@/invoke/apiCall';
import { AmplitudeExperimentState } from '@/components/AmplitudeProvider/types';

export interface SearchResult {
  id: number | string;
  catid?: number;
  compid: number | string;
  typeid: number;
  offername: string;
  companyname: string;
  logos: string;
  absoluteLogos: string;
  s3logos: string;
}

export interface SearchResultV5 {
  ID: number | string;
  LegacyID?: number;
  CatID: number;
  CompID: number | string;
  LegacyCompanyID?: number;
  TypeID: number;
  OfferName: string;
  CompanyName: string;
  offerimg: string;
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

const mapV5SearchResults = (
  searchResults: SearchResultV5[],
  useLegacyIds: boolean,
): SearchResult[] => {
  return searchResults.map((offer) => ({
    id: useLegacyIds && offer.LegacyID ? offer.LegacyID : offer.ID,
    offername: offer.OfferName,
    companyname: offer.CompanyName,
    compid: useLegacyIds && offer.LegacyCompanyID ? offer.LegacyCompanyID : offer.CompID,
    s3logos: offer.offerimg,
    logos: offer.offerimg,
    absoluteLogos: offer.offerimg,
    typeid: offer.TypeID,
  }));
};

const useSearch = (platformAdapter: IPlatformAdapter) => {
  const [status, setStatus] = useAtom(statusAtom);
  const [searchTerm, setSearchTerm] = useAtom(searchTermAtom);
  const [searchResults, setSearchResults] = useAtom(searchResultsAtom);

  const doSearch = async (term: string) => {
    setSearchTerm(term);
    setStatus(Status.Loading);
    setSearchResults([]);

    try {
      const results: SearchResultResponse = await darkRead(
        {
          experimentEnabled:
            platformAdapter.getAmplitudeFeatureFlag(FeatureFlags.SEARCH_V5_ENABLED) ===
            AmplitudeExperimentState.Treatment,
          darkReadEnabled:
            platformAdapter.getAmplitudeFeatureFlag(FeatureFlags.SEARCH_V5_ENABLED) ===
            AmplitudeExperimentState.DarkRead,
        },
        async () => v4Search(term),
        async () =>
          v5Search(
            platformAdapter,
            term,
            platformAdapter.getAmplitudeFeatureFlag(FeatureFlags.CMS_OFFERS) !== 'on',
          ),
      );

      setSearchResults(results.data);
      setStatus(Status.Success);
    } catch (err) {
      console.error('Error requesting search results', err);
      setStatus(Status.Error);
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
    doSearch,
    resetSearch,
  };
};

const v4Search = async (term: string): Promise<SearchResultResponse> => {
  const results = await invokeNativeApiCall.requestDataAsync<SearchResultResponse>(APIUrl.Search, {
    term,
  });

  if (!results?.success) {
    throw new Error('Error in search results response');
  }

  return results;
};

const v5Search = async (
  platformAdapter: IPlatformAdapter,
  term: string,
  useLegacyId = true,
): Promise<SearchResultResponse> => {
  const results = await platformAdapter.invokeV5Api(V5_API_URL.Search, {
    method: 'GET',
    queryParameters: {
      query: term,
    },
    cachePolicy: 'auto',
  });

  const parsedSearchResults = JSON.parse(results.data).data;
  return {
    success: true,
    data: mapV5SearchResults(parsedSearchResults, useLegacyId),
  };
};

export default useSearch;
