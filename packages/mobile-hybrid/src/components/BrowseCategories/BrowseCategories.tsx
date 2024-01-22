import React, { FC } from 'react';
import { BrowseCategoriesProps } from './types';

const BrowseCategories: FC<BrowseCategoriesProps> = ({ categories, onCategoryClick }) => {
  return (
    <div className="ml-2">
      <h2 className="text-2xl text-neutral-grey-900 dark:text-neutral-white pl-3 mb-4 font-bold font-museo">
        Browse Categories
      </h2>
      {categories.map((category) => (
        <div key={category.id}>
          <button
            className="font-museo pl-3 py-3 text-primary-dukeblue-700 dark:text-primary-vividskyblue-700 text-md w-full h-full text-left"
            type="button"
            onClick={() => onCategoryClick(category.id)}
          >
            {category.text}
          </button>
        </div>
      ))}
    </div>
  );
};

export default BrowseCategories;
