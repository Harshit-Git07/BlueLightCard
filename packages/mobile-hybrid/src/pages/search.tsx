import BrowseCategories from '@/components/BrowseCategories/BrowseCategories';
import InvokeNativeNavigation from '@/invoke/navigation';
import BrowseCategoriesData from 'data/BrowseCategories';
import { NextPage } from 'next';
import { useEffect, useMemo } from 'react';
import { faTag, faLocationDot } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import SearchModule from '@/modules/search';
import { SearchVariant } from '@/modules/search/types';
import { spinner } from '@/modules/Spinner/store';
import { useSetAtom } from 'jotai';

const navigation = new InvokeNativeNavigation();

const SearchPage: NextPage = () => {
  const setSpinner = useSetAtom(spinner);

  useEffect(() => {
    setSpinner(false);
  }, [setSpinner]);

  const browseCategories = useMemo(() => {
    return BrowseCategoriesData.map((category) => ({
      id: category.id,
      text: category.text,
    }));
  }, []);

  const onCategoryClick = (categoryId: number) => {
    navigation.navigate(`/category=${categoryId}`, 'search');
  };

  return (
    <div>
      <SearchModule
        variant={SearchVariant.Secondary}
        placeholder="Search for an offer"
        showFilterButton={false}
        searchDomain="search"
      />
      <div className="mt-4 mb-5 ml-2">
        <button
          className="font-museo pl-3 py-2 block text-primary-dukeblue-700 dark:text-primary-vividskyblue-700 text-md w-full h-full text-left"
          onClick={() => navigation.navigate('/mapsearch.php', 'search')}
        >
          <FontAwesomeIcon
            icon={faLocationDot}
            size="xl"
            className="pr-3 cursor-pointer text-primary-dukeblue-700 dark:text-primary-vividskyblue-700"
            aria-hidden="true"
          />
          Offers near you
        </button>
        <Link
          href={'/'}
          className="font-museo pl-3 py-2 text-primary-dukeblue-700 dark:text-primary-vividskyblue-700 text-md w-full inline-block text-left"
        >
          <FontAwesomeIcon
            icon={faTag}
            size="xl"
            className="pr-2.5 cursor-pointer text-primary-dukeblue-700 dark:text-primary-vividskyblue-700"
            aria-hidden="true"
          />
          Search for brands
        </Link>
      </div>
      <BrowseCategories categories={browseCategories} onCategoryClick={onCategoryClick} />
    </div>
  );
};

export default SearchPage;
