import { FC, useState } from 'react';
import { usePlatformAdapter } from '@bluelightcard/shared-ui';
import useSearch from '@/hooks/useSearch';
import { SearchCallbackProps } from '../types';
import SearchPresenter from '../SearchPresenter';

const SearchWithDeeplinkContainer: FC = () => {
  const platformAdapter = usePlatformAdapter();

  const [searchOverlayOpen, setSearchOverlayOpen] = useState<boolean>(false);
  const { searchTerm, resetSearch } = useSearch(platformAdapter);

  const showBackNavIcon = searchOverlayOpen;

  const onSearchInputFocus: SearchCallbackProps['onSearchInputFocus'] = () => {
    setSearchOverlayOpen(true);
  };

  const onBackButtonClick: SearchCallbackProps['onBackButtonClick'] = () => {
    setSearchOverlayOpen(false);
  };

  const onClearSearch: SearchCallbackProps['onClearSearch'] = () => {
    resetSearch();
  };

  const onSearch: SearchCallbackProps['onSearch'] = (searchTerm) => {
    setSearchOverlayOpen(false);
    platformAdapter.navigate(
      `/offers.php?type=1&opensearch=1&search=${encodeURIComponent(searchTerm)}`,
    );
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

export default SearchWithDeeplinkContainer;
