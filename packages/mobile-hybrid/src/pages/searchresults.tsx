import { useSetAtom } from 'jotai';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import { searchTerm } from '@/modules/SearchResults/store';
import { useEffect, useMemo } from 'react';
import SearchResults from '@/modules/SearchResults';
import BrowseCategories from '@/components/BrowseCategories/BrowseCategories';
import BrowseCategoriesData from 'data/BrowseCategories';
import SearchModule from '@/modules/search';
import { spinner } from '@/modules/Spinner/store';

const SearchResultsPage: NextPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchTermQuery = searchParams.get('searchTerm');
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
  }, [searchTermQuery, setTerm]);

  return (
    <div>
      <SearchModule placeholder="Search for an offer" />
      <SearchResults />
      <BrowseCategories categories={browseCategories} onCategoryClick={onCategoryClick} />
    </div>
  );
};

export default SearchResultsPage;
