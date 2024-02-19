import { useSetAtom } from 'jotai';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { searchTerm } from '@/modules/SearchResults/store';
import { useEffect, useMemo } from 'react';
import SearchResults from '@/modules/SearchResults';
import BrowseCategories from '@/components/BrowseCategories/BrowseCategories';
import BrowseCategoriesData from '@/data/BrowseCategories';
import SearchModule from '@/modules/search';
import { spinner } from '@/modules/Spinner/store';
import Amplitude from '@/components/Amplitude/Amplitude';
import { FeatureFlags } from '@/components/AmplitudeProvider/amplitudeKeys';

const SearchResultsPage: NextPage = () => {
  const router = useRouter();
  const searchTermQuery = (router.query?.searchTerm as string) ?? '';
  const setSpinner = useSetAtom(spinner);
  const setTerm = useSetAtom(searchTerm);

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
    if (searchTermQuery) {
      setTerm(searchTermQuery);
      setSpinner(true);
      return;
    }
  }, [searchTermQuery, setTerm, setSpinner]);

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
