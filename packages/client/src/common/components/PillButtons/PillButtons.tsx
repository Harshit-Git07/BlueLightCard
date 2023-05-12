import { FC, useState } from 'react';
import { PillButtonProps } from './types';
import React from 'react';
import { cssUtil } from '@/utils/cssUtil';

const PillButtons: FC<PillButtonProps> = ({ pills, disabled }) => {
  const maxSelectableNumber = 2;
  const [isSelected, setIsSelected] = useState<string[]>([]);

  const handleClick = (pillKey: string) => {
    if (isSelected.length < maxSelectableNumber && !isSelected.includes(pillKey)) {
      setIsSelected([pillKey].concat(...isSelected));
    } else if (isSelected.includes(pillKey)) {
      setIsSelected(isSelected.filter((key) => key !== pillKey));
    }
  };

  return (
    <>
      {pills.map((pillText, index) => {
        const key = `pill_${index}`;
        const selected = isSelected.includes(key);
        const _disabled =
          (isSelected.length === maxSelectableNumber && !isSelected.includes(key)) || disabled;

        const classes = cssUtil([
          selected
            ? 'bg-pillButtons-bg-selected text-pillButtons-text-selected'
            : 'bg-pillButtons-bg-base  text-pillButtons-text-base',
          _disabled ? 'opacity-25' : '',
          'transition rounded-full m-2 py-2 px-4 min-w-btn focus:outline-none',
        ]);
        return (
          <button
            key={key}
            onClick={() => !_disabled && handleClick(key)}
            disabled={_disabled}
            className={classes}
          >
            {pillText}
          </button>
        );
      })}
    </>
  );
};

export default PillButtons;
