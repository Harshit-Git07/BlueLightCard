import React, { FC } from 'react';
import { ChevronProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-regular-svg-icons';

export const Chevron: FC<ChevronProps> = ({ id, dropdownClicked, setDropdownClicked }) => {
  return (
    <button
      id={id}
      className="ml-[10px] mr-[10px] text-zinc-500"
      onClick={() => {
        setDropdownClicked(!dropdownClicked);
      }}
    >
      {dropdownClicked ? (
        <FontAwesomeIcon icon={faChevronDown} />
      ) : (
        <FontAwesomeIcon icon={faChevronUp} />
      )}
    </button>
  );
};
export default Chevron;
