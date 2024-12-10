import Amplitude from '@/components/Amplitude/Amplitude';
import { FeatureFlags } from '@/components/AmplitudeProvider/amplitudeKeys';
import RecentSearchButton from '@/components/RecentSearchButton/RecentSearchButton';
import { recentSearchesData } from '@/constants';
import { SearchBar, SearchProps } from '@bluelightcard/shared-ui';
import { FC } from 'react';
import { SearchCallbackProps } from './types';
import { GetSearchVariant } from '@/experiments/getSearchVariant';

export type Props = SearchCallbackProps & {
  placeholderText?: SearchProps['placeholderText'];
  searchTerm: SearchProps['value'];
  showBackNavIcon: SearchProps['showBackArrow'];
  searchOverlayOpen: boolean;
};

const SearchPresenter: FC<Props> = ({
  placeholderText = 'Search offers or brands',
  searchTerm,
  showBackNavIcon,
  searchOverlayOpen,
  onSearchInputFocus,
  onBackButtonClick,
  onClearSearch,
  onSearch,
}) => {
  const searchVariant = GetSearchVariant();

  return (
    <>
      <div className="flex items-center justify-between">
        {/* Conversion experiment */}
        <SearchBar
          onFocus={onSearchInputFocus}
          onBackButtonClick={onBackButtonClick}
          onClear={onClearSearch}
          placeholderText={placeholderText}
          value={searchTerm}
          showBackArrow={showBackNavIcon}
          onSearch={onSearch}
          experimentalSearchVariant={searchVariant}
        />
      </div>
      {searchOverlayOpen && (
        <Amplitude keyName={FeatureFlags.SEARCH_RECENT_SEARCHES} value={'on'}>
          <div className="h-full w-full fixed bg-neutral-white dark:bg-neutral-black left-0 top-0 z-[5]">
            <div className="mx-2 absolute top-24">
              <h3 className="mx-2 mb-2 text-2xl font-bold text-neutral-grey-900 dark:text-primary-vividskyblue-700">
                Your recent searches
              </h3>
              {recentSearchesData.map((term) => (
                <RecentSearchButton
                  key={term}
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

export default SearchPresenter;
