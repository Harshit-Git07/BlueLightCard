import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import { usePlatformAdapter } from '@bluelightcard/shared-ui';
import useSearch from '@/hooks/useSearch';
import { SearchCallbackProps } from '../types';
import SearchPresenter from '../SearchPresenter';

export const backNavagationalPaths = ['/searchresults', '/categories', '/brands'];

const SearchWithNavContainer: FC = () => {
  const router = useRouter();
  const platformAdapter = usePlatformAdapter();

  const [searchOverlayOpen, setSearchOverlayOpen] = useState<boolean>(false);
  const { searchTerm, resetSearch } = useSearch(platformAdapter);

  const showBackNavIcon = backNavagationalPaths.includes(router.route) || searchOverlayOpen;

  const onSearchInputFocus: SearchCallbackProps['onSearchInputFocus'] = () => {
    setSearchOverlayOpen(true);
  };

  const onBackButtonClick: SearchCallbackProps['onBackButtonClick'] = () => {
    setSearchOverlayOpen(false);
    if (showBackNavIcon) {
      router.replace('/search');
    }
  };

  const onClearSearch: SearchCallbackProps['onClearSearch'] = () => {
    resetSearch();
  };

  const onSearch: SearchCallbackProps['onSearch'] = (searchTerm) => {
    setSearchOverlayOpen(false);
    router.push(`/searchresults?search=${searchTerm}`);
  };

  return (
    <SearchPresenter
      searchTerm={searchTerm}
      showBackNavIcon={showBackNavIcon}
      searchOverlayOpen={searchOverlayOpen}
      onSearchInputFocus={onSearchInputFocus}
      onBackButtonClick={onBackButtonClick}
      onClearSearch={onClearSearch}
      onSearch={onSearch}
    />
  );
};

export default SearchWithNavContainer;
