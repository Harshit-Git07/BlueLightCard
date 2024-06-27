import { FC, useCallback, useState } from 'react';
import { faBarsFilter } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FilterProps } from './types';
import { useAtomValue } from 'jotai';
import { filters } from '@/modules/filterpanel/store/filters';

const Filter: FC<FilterProps> = ({ onClick, filterCount }) => {
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const _filters = useAtomValue(filters);

  const onFilterClick = useCallback(() => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
    onClick();
  }, [isFilterPanelOpen, onClick]);

  const icon =
    filterCount > 0 ? (
      <div className="w-6 h-6 rounded-full bg-primary-dukeblue-600 text-neutral-white dark:text-primary-dukeblue-600 dark:bg-primary-vividskyblue-700 text-[10px] absolute left-[54px] top-[5px] flex items-center justify-center">
        {_filters?.length}
      </div>
    ) : (
      <FontAwesomeIcon
        icon={faBarsFilter}
        size="lg"
        role="button"
        className="absolute text-primary-dukeblue-600 right-2 top-[8px] dark:text-primary-vividskyblue-700"
        aria-hidden="true"
      />
    );
  return (
    <div>
      <button
        onClick={onFilterClick}
        className="relative w-[86px] h-[36px] z-10 dark:text-primary-vividskyblue-700 text-primary-dukeblue-600 rounded pr-8 pl-2"
      >
        Filter
        {icon}
      </button>
    </div>
  );
};

export default Filter;
