import { FC, useCallback, useState } from 'react';
import { SearchModuleProps, SearchVariant } from './types';
import Search from '@/components/Search/Search';
import RecentSearchButton from '@/components/RecentSearchButton/RecentSearchButton';
import { recentSearchesData } from '@/constants';
import InvokeNativeNavigation from '@/invoke/navigation';
import Filter from '@/components/Filter/Filter';
import { useAtom, useAtomValue } from 'jotai';
import { filters, isFilterPanelOpenAtom } from '@/modules/filterpanel/store/filters';

const navigation = new InvokeNativeNavigation();
const SearchModule: FC<SearchModuleProps> = ({ variant, showFilterButton, placeholder }) => {
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
  }, []);

  return (
    <>
      <div className="flex items-center p-2 justify-between">
        <Search
          onFocus={onSearchInputFocus}
          onBackButtonClick={onBack}
          placeholderText={placeholder}
          onSearch={(searchTerm) =>
            navigation.navigate(
              `/offers.php?type=1&opensearch=1&search=${encodeURIComponent(searchTerm)}`,
            )
          }
        />

        {variant === SearchVariant.Primary && showFilterButton && (
          <Filter onClick={onFilterClick} filterCount={_filters?.length} />
        )}
      </div>
      {searchOverlayOpen && (
        <div className="h-screen w-full absolute bg-neutral-white dark:bg-neutral-black left-0 top-0">
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
