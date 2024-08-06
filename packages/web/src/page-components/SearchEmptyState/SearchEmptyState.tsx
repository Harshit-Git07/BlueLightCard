import React, { FC, useContext } from 'react';
import { PillGroup } from '@bluelightcard/shared-ui/index';
import { SearchEmptyStateProps } from './types';
import useFetchCompaniesOrCategories, { CategoryType } from '@/hooks/useFetchCompaniesOrCategories';
import UserContext from '@/context/User/UserContext';

type SearchEmptyStatePresenterProps = {
  onSearchCategoryChange: (categoryId: string, categoryName: string) => void;
  categories: CategoryType[];
  isLoading: boolean;
};

export const SearchEmptyStatePresenter: FC<SearchEmptyStatePresenterProps> = ({
  onSearchCategoryChange,
  categories,
  isLoading,
}) => {
  const changeCategoryHandler = (categoryId: string, categoryName: string) => {
    onSearchCategoryChange(categoryId, categoryName);
  };

  return (
    <div className="w-full mb-8 tablet:mb-[100px]">
      <p className="font-typography-title-large text-typography-title-large font-typography-title-large-weight tracking-typography-title-large leading-typography-title-large pb-[25px]">
        No results found
      </p>
      <div className="border-b border-colour-onSurface-outline-light dark:border-colour-onSurface-outline-dark"></div>
      <div className="mt-[25px]">
        <PillGroup
          title={'Browse Categories'}
          pillGroup={categories.map((cat) => ({
            id: Number(cat.id),
            label: cat.name,
          }))}
          onSelectedPill={(id) => {
            const selectedCategory = categories.find((cat) => cat.id === id.toString());
            if (selectedCategory) {
              changeCategoryHandler(selectedCategory.id, selectedCategory.name);
            }
          }}
        />
      </div>
    </div>
  );
};

const SearchEmptyState: FC<SearchEmptyStateProps> = ({ onSearchCategoryChange }) => {
  const userCtx = useContext(UserContext);
  const { categories, isLoading } = useFetchCompaniesOrCategories(userCtx);

  return (
    <SearchEmptyStatePresenter
      categories={categories}
      onSearchCategoryChange={onSearchCategoryChange}
      isLoading={isLoading}
    />
  );
};

export default SearchEmptyState;
