import React, { FC, useEffect, useState } from 'react';
import { FilterPillButtonProps } from './types';
import { cssUtil } from '@/utils/cssUtil';

const FilterPillButton: FC<FilterPillButtonProps> = ({ onSelected, pills }) => {
  const [selectedPills, setSelectedPills] = useState<string[]>([]);

  useEffect(() => {
    if (onSelected) {
      onSelected(selectedPills);
    }
  }, [selectedPills, onSelected]);

  const getButtonClasses = (value: string) => {
    const isSelected = selectedPills.includes(value);
    const baseClasses = cssUtil([
      'transition text-grey-500 rounded-full m-2 py-2 px-4 min-w-btn focus:outline-none',
      isSelected ? 'bg-primary-dukeblue-400/30 text-primary-dukeblue-600' : '',
    ]);

    return baseClasses;
  };

  const togglePill = (value: string) => {
    setSelectedPills((prevSelected) => {
      if (prevSelected.includes(value)) {
        return prevSelected.filter((item) => item !== value);
      } else {
        return [...prevSelected, value];
      }
    });
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
