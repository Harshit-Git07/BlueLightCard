import React, { FC, FormEventHandler, useRef } from 'react';
import { SearchProps } from './types';
import { faSearch } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Search: FC<SearchProps> = ({ onSearch, labelText }) => {
  const initialValue = useRef<HTMLInputElement>(null);
  const onSubmit: FormEventHandler<HTMLFormElement> = () => {
    const searchTerm = initialValue.current?.value.trim() ?? '';
    onSearch(searchTerm);
  };
  return (
    <form onSubmit={onSubmit} className="mx-4 my-2">
      <div className="relative">
        <FontAwesomeIcon
          icon={faSearch}
          className="absolute left-3 px-2 top-1/2 transform -translate-y-1/2 text-neutral-grey-800 dark:text-primary-vividskyblue-700"
          aria-hidden="true"
        />
        <input
          aria-label={labelText}
          id="searchInput"
          ref={initialValue}
          placeholder="Search stores or brands"
          type="text"
          className="px-12 py-3 font-museo rounded-full w-full overflow-x-hidden bg-neutral-grey-100 border-neutral-grey-200 border dark:border-neutral-700 dark:bg-neutral-grey-800 focus:outline-none"
        />
      </div>
    </form>
  );
};

export default Search;
