import { FC, useCallback, useState } from 'react';
import { SearchModuleProps } from './types';
import Search from '@/components/Search/Search';
import RecentSearchButton from '@/components/RecentSearchButton/RecentSearchButton';
import { recentSearchesData } from '@/constants';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { searchTerm } from '@/modules/SearchResults/store';

const SearchModule: FC<SearchModuleProps> = ({ placeholder }) => {
  const [term, setTerm] = useAtom(searchTerm);
  const router = useRouter();
  const [searchOverlayOpen, setSearchOverlayOpen] = useState<boolean>(false);

  const onSearchInputFocus = useCallback(() => {
    setSearchOverlayOpen(true);
  }, []);

  const onBack = useCallback(() => {
    setSearchOverlayOpen(false);
  }, []);

  const onClear = useCallback(() => {
    setTerm('');
  }, [setTerm]);

  return (
    <>
      <div className="flex items-center px-2 pt-2 justify-between">
        <Search
          onFocus={onSearchInputFocus}
          onBackButtonClick={onBack}
          onClear={onClear}
          placeholderText={placeholder}
          value={term}
          onSearch={(searchTerm) => {
            router.push(`/searchresults?searchTerm=${searchTerm}`);
          }}
        />
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
