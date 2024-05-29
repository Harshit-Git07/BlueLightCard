import { APIUrl, CDN_URL, V5_API_URL } from '@/globals';
import useAPI, { APIResponse } from './useAPI';
import { useEffect, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { usePlatformAdapter } from '@bluelightcard/shared-ui';
import { Experiments, FeatureFlags } from '@/components/AmplitudeProvider/amplitudeKeys';
import { SearchResults, SearchResultsV5, SearchResultV5 } from '@/modules/SearchResults/types';
import { experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';
import InvokeNativeAPICall from '@/invoke/apiCall';
import { searchResults } from '@/modules/SearchResults/store';
import { userProfile } from '@/components/UserProfileProvider/store';

const request = new InvokeNativeAPICall();

const useSearchResults = (term?: string) => {
  const amplitudeExperiment = useAtomValue(experimentsAndFeatureFlags);
  const userProfileValue = useAtomValue(userProfile);
  const platformAdapter = usePlatformAdapter();
  const [searchResultsDataV5, setSearchResultsDataV5] = useState<
    APIResponse<SearchResultsV5> | undefined
  >();
  const setResultsWrapper = useSetAtom(searchResults);

  const categoryTreeExperimentExperiment =
    amplitudeExperiment[Experiments.CATEGORY_LEVEL_THREE_SEARCH] === 'treatment';
  const v5ApiFeatureFlag = amplitudeExperiment[FeatureFlags.V5_API_INTEGRATION] === 'on';
  const categoryTreeExperimentEnabled = v5ApiFeatureFlag && categoryTreeExperimentExperiment;

  const searchResultsData = useAPI(APIUrl.Search) as APIResponse<SearchResults>;

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (term) {
        if (categoryTreeExperimentEnabled) {
          const result = await platformAdapter.invokeV5Api(V5_API_URL.Search, {
            method: 'GET',
            queryParameters: {
              query: term,
              organisation: userProfileValue?.service ?? '',
              isAgeGated: `${userProfileValue?.isAgeGated ?? 'false'}`,
            },
            cachePolicy: 'auto',
          });
          setSearchResultsDataV5({
            data: JSON.parse(result.data).data,
          });
        } else {
          request.requestData(APIUrl.Search, { term });
        }
      }
    };

    fetchSearchResults();
  }, [term, categoryTreeExperimentEnabled, platformAdapter, userProfileValue]);

  useEffect(() => {
    let searchResults: SearchResults | undefined = undefined;

    if (categoryTreeExperimentEnabled) {
      if (searchResultsDataV5 && searchResultsDataV5.data) {
        searchResults = mapV5SearchResults(searchResultsDataV5.data);
        setSearchResultsDataV5(undefined);
      }
    } else {
      if (searchResultsData && searchResultsData.data) {
        searchResults = searchResultsData.data;
      }
    }

    if (searchResults) {
      if (searchResults.length > 0) {
        setResultsWrapper({ results: searchResults, term });
        return;
      }
    }
    setResultsWrapper({ results: [], term });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchResultsData, searchResultsDataV5, setResultsWrapper]);
};

const mapV5SearchResults = (searchResults: SearchResultsV5) => {
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

export default useSearchResults;
