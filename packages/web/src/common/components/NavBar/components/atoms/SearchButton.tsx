import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/pro-solid-svg-icons';

type Props = {
  onIconClick: () => void;
};

const SearchButton = ({ onIconClick }: Props) => {
  return (
    <button
      data-testid="search-button"
      className={`flex h-full justify-center items-center gap-1 cursor-pointer text-NavBar-icon-colour hover:text-NavBar-link-hover-colour dark:text-NavBar-icon-colour-dark dark:hover:text-NavBar-link-hover-colour-dark`}
      onClick={onIconClick}
    >
      <FontAwesomeIcon icon={faMagnifyingGlass} />
    </button>
  );
};

export default SearchButton;
