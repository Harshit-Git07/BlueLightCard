import { FC, useState } from 'react';
import { PillButtonProps } from './types';
import React from 'react';

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

        return (
          <button
            key={key}
            onClick={() => handleClick(key)}
            className={`${
              _disabled ? 'opacity-25 ' : 'hover:bg-primary-type-1-900 hover:text-white '
            }${
              selected ? 'bg-primary-type-1-base text-white ' : 'bg-neutrals-type-1-400 text-black '
            } transition rounded-full mr-4 py-2 px-4 min-w-btn focus:outline-none`}
          >
            {pillText}
          </button>
        );
      })}
    </>
  );
};

export default PillButtons;
