import React, { FC } from 'react';
import { PillGroup } from '@bluelightcard/shared-ui/index';
import { pillGroup } from './constants';

const SearchEmptyState: FC = () => {
  return (
    <div className="w-full mb-8 tablet:mb-[100px]">
      <p className="font-typography-title-large text-typography-title-large font-typography-title-large-weight tracking-typography-title-large leading-typography-title-large tablet:px-4 pb-[25px]">
        No results found
      </p>
      <div className="border-b border-colour-onSurface-outline-light dark:border-colour-onSurface-outline-dark tablet:mx-4"></div>
      <div className="mt-[25px]">
        <PillGroup
          pillGroup={pillGroup}
          onSelectedPill={() => void 0}
          title={'Browse Categories'}
        />
      </div>
    </div>
  );
};

export default SearchEmptyState;
