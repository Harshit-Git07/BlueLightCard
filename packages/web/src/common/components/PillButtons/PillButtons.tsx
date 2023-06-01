import { FC, useEffect, useState } from 'react';
import { PillButtonProps } from './types';
import React from 'react';
import { cssUtil } from '@/utils/cssUtil';

const PillButtons: FC<PillButtonProps> = ({ pills, onSelected }) => {
  const maxSelectableNumber = 2;
  const [isSelected, setIsSelected] = useState<string[]>([]);

  useEffect(() => {
    if (onSelected) {
      onSelected(isSelected);
    }
  }, [isSelected]);

  const toggleSelection = (pillKey: string) => {
    if (!isSelected.includes(pillKey)) {
      if (isSelected.length < maxSelectableNumber) {
        setIsSelected([pillKey, ...isSelected]);
        // reset selection if user tries to select a third pill
      } else {
        setIsSelected([pillKey, ...isSelected.slice(1, -1)]);
      }
    } else {
      setIsSelected(isSelected.filter((key) => key !== pillKey));
    }
  };

  return (
    <div role="listbox" aria-multiselectable="true">
      {pills.map((pill, index) => {
        const key = `key_${index}`;
        const selected = isSelected.includes(pill.value);

        const classes = cssUtil([
          selected
            ? 'bg-pillButtons-bg-selected text-pillButtons-text-selected'
            : 'bg-pillButtons-bg-base  text-pillButtons-text-base',
          'transition rounded-full m-2 py-2 px-8 min-w-btn focus:outline-none',
        ]);
        return (
          <button key={key} onClick={() => toggleSelection(pill.value)} className={classes}>
            {pill.text}
          </button>
        );
      })}
    </div>
  );
};

export default PillButtons;
