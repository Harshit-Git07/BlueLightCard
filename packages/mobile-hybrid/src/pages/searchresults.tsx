import { useAtomValue, useSetAtom } from 'jotai';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import SearchResults from '@/modules/SearchResults';
import BrowseCategories from '@/components/BrowseCategories/BrowseCategories';
import BrowseCategoriesData from '@/data/BrowseCategories';
import SearchModule from '@/modules/search';
import Amplitude from '@/components/Amplitude/Amplitude';
import { FeatureFlags } from '@/components/AmplitudeProvider/amplitudeKeys';
import { spinner } from '@/modules/Spinner/store';
import useSearch from '@/hooks/useSearch';
import { usePlatformAdapter } from '../../../shared-ui/src/adapters';
import { userProfile } from '@/components/UserProfileProvider/store';

const SearchResultsPage: NextPage = () => {
  const router = useRouter();
  const searchQueryValue = (router.query?.search as string) ?? '';
  const setSpinner = useSetAtom(spinner);

  const userProfileValue = useAtomValue(userProfile);

  const platformAdapter = usePlatformAdapter();
  const { doSearch } = useSearch(platformAdapter);

  const browseCategories = useMemo(() => {
    return BrowseCategoriesData.map((category) => ({
      id: category.id,
      text: category.text,
    }));
  }, []);

  const onCategoryClick = (categoryId: number) => {
    router.push(`/categories?category=${categoryId}`);
  };

  useEffect(() => {
    const search = async () => {
      setSpinner(true);
      await doSearch(searchQueryValue, userProfileValue?.service, userProfileValue?.isAgeGated);
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
      <Amplitude keyName={FeatureFlags.SEARCH_RESULTS_PAGE_CATEGORIES_LINKS} value="on">
        <BrowseCategories categories={browseCategories} onCategoryClick={onCategoryClick} />
      </Amplitude>
    </div>
  );
};

export default SearchResultsPage;
