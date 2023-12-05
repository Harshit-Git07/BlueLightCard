import React, { FC, useState } from 'react';
import { faBarsFilter } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FilterProps } from './types';

const Filter: FC<FilterProps> = ({ onPress, filterCount }) => {
  const onPressHandler = () => {
    onPress && onPress();
  };

  const icons =
    filterCount > 0 ? (
      <div className="w-6 h-6 rounded-full bg-primary-dukeblue-600 text-neutral-white dark:text-primary-dukeblue-600 dark:bg-primary-vividskyblue-700 text-[10px] absolute left-[54px] top-[5px] flex items-center font-museo justify-center">
        {filterCount}
      </div>
    ) : (
      <FontAwesomeIcon
        icon={faBarsFilter}
        role="button"
        className="absolute text-primary-dukeblue-600 left-14 top-[10px] dark:text-primary-vividskyblue-700"
        aria-hidden="true"
      />
    );
  return (
    <div>
      <button
        onClick={onPressHandler}
        className="relative w-[86px] h-[36px] font-museo dark:text-primary-vividskyblue-700 text-primary-dukeblue-600 rounded pr-10 pl-2 m-2"
      >
        Filter
        {icons}
      </button>
    </div>
  );
};

export default Filter;
