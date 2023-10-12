import React from 'react';
import { FC } from 'react';
import { ChevronProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/pro-regular-svg-icons';

export const Chevron: FC<ChevronProps> = ({ id, show }) => {
  if (show) {
    return (
      <span id={id} className="ml-[10px] mr-[10px]">
        <FontAwesomeIcon icon={faChevronDown} size="lg" />
      </span>
    );
  } else {
    return <div></div>;
  }
};
export default Chevron;
