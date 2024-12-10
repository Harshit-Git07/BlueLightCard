import { FC, useCallback, useState } from 'react';
import { SearchModuleProps, SearchProps } from './types';
import Amplitude from '@/components/Amplitude/Amplitude';
import { SearchBar } from '@bluelightcard/shared-ui';
import RecentSearchButton from '@/components/RecentSearchButton/RecentSearchButton';
import useSearch from '@/hooks/useSearch';
import { recentSearchesData } from '@/constants';
import { useRouter } from 'next/router';
import { backNavagationalPaths } from './paths';
import { FeatureFlags } from '@/components/AmplitudeProvider/amplitudeKeys';
import { usePlatformAdapter } from '../../../../shared-ui/src/adapters';
import { GetSearchVariant } from '@/experiments/getSearchVariant';

const SearchModule: FC<SearchModuleProps> = ({ placeholder }) => {
  const router = useRouter();
  const [searchOverlayOpen, setSearchOverlayOpen] = useState<boolean>(false);

  const platformAdapter = usePlatformAdapter();
  const { searchTerm, resetSearch } = useSearch(platformAdapter);

  const canBackNav = backNavagationalPaths.includes(router.route) && !searchOverlayOpen;

  const onSearchInputFocus = useCallback(() => {
    setSearchOverlayOpen(true);
  }, []);

  const onBack = useCallback(() => {
    setSearchOverlayOpen(false);
    if (canBackNav) {
      router.replace('/search');
    }
  }, [canBackNav, router]);

  const onSearch = useCallback<SearchProps['onSearch']>(
    (termInput: string) => {
      setSearchOverlayOpen(false);
      router.push(`/searchresults?search=${termInput}`);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router],
  );

  const onClear = useCallback(() => {
    resetSearch();
  }, [resetSearch]);

  const searchVariant = GetSearchVariant();

  return (
    <>
      <div className="flex items-center justify-between">
        {/* Conversion experiment */}
        <SearchBar
          onFocus={onSearchInputFocus}
          onBackButtonClick={onBack}
          onClear={onClear}
          placeholderText={placeholder}
          value={searchTerm}
          showBackArrow={canBackNav}
          onSearch={onSearch}
          experimentalSearchVariant={searchVariant}
        />
      </div>
      {searchOverlayOpen && (
        <Amplitude keyName={FeatureFlags.SEARCH_RECENT_SEARCHES} value={'on'}>
          <div className="h-full w-full fixed bg-neutral-white dark:bg-neutral-black left-0 top-0 z-[5]">
            <div className="mx-2.5 absolute top-28">
              <h3 className="mx-2 mb-2 text-2xl font-bold text-neutral-grey-900 dark:text-primary-vividskyblue-700">
                Your recent searches
              </h3>
              {recentSearchesData.map((term, index) => (
                <RecentSearchButton
                  key={index}
                  onClick={() => {
                    console.log(term);
                  }}
                  text={term}
                />
              ))}
            </div>
          </div>
        </Amplitude>
      )}
    </>
  );
};

export default SearchModule;
