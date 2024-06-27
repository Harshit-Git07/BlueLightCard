import { FC, useEffect, useState } from 'react';
import { FilterPillButtonProps } from './types';
import { cssUtil } from '@/utils/cssUtil';

const FilterPillButton: FC<FilterPillButtonProps> = ({
  onSelected,
  onDeselected,
  selected,
  pills,
}) => {
  const [selectedPills, setSelectedPills] = useState<string[]>([]);

  useEffect(() => {
    if (selected) {
      setSelectedPills(
        pills.filter((pill) => selected.includes(pill.value)).map((pill) => pill.value),
      );
    }
  }, [selected, setSelectedPills, pills]);

  const getButtonClasses = (value: string) => {
    const isSelected = selectedPills.includes(value);
    const baseClasses = cssUtil([
      'transition rounded-full m-1 h-[36px] px-4 py-2 min-w-btn focus:outline-none',
      isSelected
        ? 'bg-primary-dukeblue-400/30 text-primary-dukeblue-600 dark:text-primary-vividskyblue-700'
        : 'bg-neutral-grey-100/50 text-neutral-grey-600 dark:bg-neutral-800 dark:text-neutral-white',
    ]);

    return baseClasses;
  };

  const togglePill = (value: string) => {
    if (selectedPills.includes(value)) {
      if (onDeselected) {
        onDeselected(value);
      }
      setSelectedPills(selectedPills.filter((filter) => filter !== value));
    } else {
      if (onSelected) {
        onSelected(value);
      }
      setSelectedPills([value].concat(...selectedPills));
    }
  };

  return (
    <div>
      {pills.map((pill, index) => {
        const key = `key_${index}`;

        return (
          <button
            key={key}
            className={getButtonClasses(pill.value)}
            onClick={() => togglePill(pill.value)}
          >
            {pill.text}
          </button>
        );
      })}
    </div>
  );
};

export default FilterPillButton;
