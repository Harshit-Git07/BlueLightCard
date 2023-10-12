import React from 'react';
import { FC } from 'react';
import { SearchProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/pro-regular-svg-icons';

export const Search: FC<SearchProps> = ({ id, show }) => {
  if (show) {
    return (
      <div id={id} className="relative mr-3 w-full max-w-[250px] md:max-w-[375px]">
        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-lg border border-stroke bg-gray py-3 pl-5 pr-12 text-body-color outline-none focus:border-primary focus:bg-white"
        />
        <span className="absolute top-1/2 right-5 -translate-y-1/2">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </span>
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default Search;
