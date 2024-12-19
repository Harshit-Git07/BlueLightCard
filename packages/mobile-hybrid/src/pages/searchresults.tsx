import { useSetAtom } from 'jotai';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import SearchResults from '@/modules/SearchResults';
import BrowseCategories from '@/components/BrowseCategories/BrowseCategories';
import SearchModule from '@/modules/search';
import Amplitude from '@/components/Amplitude/Amplitude';
import { FeatureFlags } from '@/components/AmplitudeProvider/amplitudeKeys';
import { spinner } from '@/modules/Spinner/store';
import useSearch from '@/hooks/useSearch';
import { usePlatformAdapter } from '../../../shared-ui/src/adapters';
import { SimpleCategoryData } from '@bluelightcard/shared-ui/types';

const SearchResultsPage: NextPage = () => {
  const router = useRouter();
  const searchQueryValue = (router.query?.search as string) ?? '';
  const setSpinner = useSetAtom(spinner);

  const platformAdapter = usePlatformAdapter();
  const { doSearch, searchResults, status } = useSearch(platformAdapter);

  const onCategoryClick = (category: SimpleCategoryData) => {
    platformAdapter.navigate(`/category?id=${category.id}`);
  };

  useEffect(() => {
    const search = async () => {
      setSpinner(true);
      await doSearch(searchQueryValue);
      setSpinner(false);
    };

    if (searchQueryValue) {
      search();
    }
  }, [searchQueryValue]);

  return (
    <div>
      <SearchModule placeholder="Search for an offer" />
      <SearchResults />

      <Amplitude keyName={FeatureFlags.MODERN_CATEGORIES_HYBRID} value="on">
        <BrowseCategories onCategoryClick={onCategoryClick} />
      </Amplitude>
    </div>
  );
};

export default SearchResultsPage;
