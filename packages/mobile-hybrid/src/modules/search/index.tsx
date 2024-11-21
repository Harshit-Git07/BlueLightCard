import { FC } from 'react';
import SearchWithNavContainer from './components/use-cases/SearchWithNavContainer';
import SearchWithDeeplinkContainer from './components/use-cases/SearchWithDeeplinkContainer';

export type Props = {
  useDeeplinkVersion?: boolean;
};

const SearchModule: FC<Props> = ({ useDeeplinkVersion }) => {
  if (useDeeplinkVersion) {
    return <SearchWithDeeplinkContainer />;
  }

  return <SearchWithNavContainer />;
};

export default SearchModule;
