import { useSetAtom } from 'jotai';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { searchTerm } from '@/modules/SearchResults/store';
import { useEffect, useMemo } from 'react';
import SearchResults from '@/modules/SearchResults';
import BrowseCategories from '@/components/BrowseCategories/BrowseCategories';
import BrowseCategoriesData from 'data/BrowseCategories';
import SearchModule from '@/modules/search';
import { SearchVariant } from '@/modules/search/types';

const SearchResultsPage: NextPage = () => {
  const router = useRouter();
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
    if (router.query?.searchTerm) {
      setTerm({ term: router.query.searchTerm });
      console.log('searchTerm', router.query.searchTerm);
      return;
    }
  }, [router.query.searchTerm, setTerm]);
  return (
    <div>
      {/* <SearchModule
        variant={SearchVariant.Primary}
        placeholder="Search for an offer"
        showFilterButton={true}
        searchDomain={''}
      /> */}
      <SearchResults />
      <BrowseCategories categories={browseCategories} onCategoryClick={onCategoryClick} />
    </div>
  );
};

export default SearchResultsPage;
