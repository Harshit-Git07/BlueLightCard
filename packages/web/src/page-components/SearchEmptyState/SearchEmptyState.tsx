import React, { FC } from 'react';

export const SearchEmptyStatePresenter: FC = () => {
  return (
    <div className="w-full">
      <p className="font-typography-title-large text-typography-title-large font-typography-title-large-weight tracking-typography-title-large leading-typography-title-large pb-[25px]">
        No results found
      </p>
      <div className="border-b border-colour-onSurface-outline-light dark:border-colour-onSurface-outline-dark"></div>
    </div>
  );
};

const SearchEmptyState: FC = () => {
  return <SearchEmptyStatePresenter />;
};

export default SearchEmptyState;
