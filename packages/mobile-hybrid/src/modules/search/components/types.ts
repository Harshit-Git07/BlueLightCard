import { SearchProps } from '@bluelightcard/shared-ui';

export type SearchCallbackProps = {
  onSearchInputFocus: SearchProps['onFocus'];
  onBackButtonClick: SearchProps['onBackButtonClick'];
  onClearSearch: SearchProps['onClear'];
  onSearch: SearchProps['onSearch'];
};
