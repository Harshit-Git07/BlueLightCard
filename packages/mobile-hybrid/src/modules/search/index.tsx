import { FC, use, useCallback, useEffect, useState } from 'react';
import { SearchModuleProps, SearchVariant } from './types';
import Search from '@/components/Search/Search';
import RecentSearchButton from '@/components/RecentSearchButton/RecentSearchButton';
import { recentSearchesData } from '@/constants';
import InvokeNativeNavigation from '@/invoke/navigation';
import Filter from '@/components/Filter/Filter';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { filters, isFilterPanelOpenAtom } from '@/modules/filterpanel/store/filters';
import { useRouter } from 'next/router';
import { searchTerm } from '@/modules/SearchResults/store';

// const navigation = new InvokeNativeNavigation();

const SearchModule: FC<SearchModuleProps> = ({ variant, showFilterButton, placeholder }) => {
  const setTerm = useSetAtom(searchTerm);
  const router = useRouter();
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useAtom(isFilterPanelOpenAtom);
  const [searchOverlayOpen, setSearchOverlayOpen] = useState<boolean>(false);
  const [_filters] = useAtomValue(filters);

  const onFilterClick = useCallback(() => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  }, [isFilterPanelOpen, setIsFilterPanelOpen]);

  const onSearchInputFocus = useCallback(() => {
    setSearchOverlayOpen(true);
  }, []);

  const onBack = useCallback(() => {
    setSearchOverlayOpen(false);
    // navigation.goBack();

    router.back();
  }, [router]);

  useEffect(() => {
    if (router.query?.searchTerm) {
      setTerm(router.query.searchTerm as any);
      console.log('searchTerm', router.query.searchTerm);
    }
  }, [router.query, setTerm]);

  return (
    <>
      <div className="flex items-center px-2 pt-2 justify-between">
        <Search
          onFocus={onSearchInputFocus}
          onBackButtonClick={onBack}
          placeholderText={placeholder}
          onSearch={(searchTerm) => {
            router.push(`/searchresults?searchTerm=${searchTerm}`);
          }}
        />

        {variant === SearchVariant.Primary && showFilterButton && (
          <Filter onClick={onFilterClick} filterCount={_filters?.length} />
        )}
      </div>
      {searchOverlayOpen && (
        <div className="h-screen w-full absolute bg-neutral-white dark:bg-neutral-black left-0 top-0 z-[5]">
          <div className="mx-2 absolute top-24">
            <h3 className="mx-2 mb-2 text-2xl font-museo font-bold text-neutral-grey-900 dark:text-primary-vividskyblue-700">
              Your recent searches
            </h3>
            {recentSearchesData.map((searchTerm, index) => (
              <RecentSearchButton
                key={index}
                onClick={() => {
                  console.log(searchTerm);
                }}
                text={searchTerm}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default SearchModule;
