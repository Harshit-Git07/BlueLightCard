import { FC } from 'react';
import { cssUtil } from '@/utils/cssUtil';
import { FilterHeaderProps } from './types';

const FilterHeader: FC<FilterHeaderProps> = ({ onDoneClick, onResetClick, resetEnabled }) => {
  const resetButtonClasses = cssUtil([
    resetEnabled
      ? 'enabled:text-primary-dukeblue-600 cursor-pointer dark:text-primary-vividskyblue-700'
      : 'disabled text-neutral-grey-600 dark:text-neutral-grey-400 cursor-not-allowed',
    'px-4',
  ]);

  return (
    <div className="rounded-t-3xl h-[56px] bg-neutral-white dark:bg-neutral-grey-800 flex justify-between">
      <button disabled={!resetEnabled} onClick={onResetClick} className={resetButtonClasses}>
        Reset
      </button>
      <div className="flex items-center">
        <h3 className="text-xl text-neutral-oxfordblue-900 dark:text-neutral-white font-semibold">
          Filter
        </h3>
      </div>
      <button
        onClick={onDoneClick}
        className="px-4 text-primary-dukeblue-600 dark:text-primary-vividskyblue-700"
      >
        Done
      </button>
    </div>
  );
};

export default FilterHeader;
