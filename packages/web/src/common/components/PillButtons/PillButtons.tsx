import React, { FC } from 'react';
import { PillButtonProps } from './types';
import { cssUtil } from '@/utils/cssUtil';

const PillButtons: FC<PillButtonProps> = ({
  text,
  iconLeft,
  iconRight,
  disabled = false,
  onSelected,
  outline,
  isSelected,
}) => {
  const handleClick = () => {
    if (!isSelected && !disabled) {
      onSelected(text);
    }
  };

  const classes = cssUtil([
    isSelected ? 'bg-[#001B80] text-white' : 'bg-[#ECEFF2]',
    `font-['MuseoSans'] text-[#202125] font-light rounded-[56px] desktop:py-3 px-3 mobile:py-2 whitespace-nowrap text-base`,
    disabled ? 'cursor-not-allowed bg-white text-[#DCDCDC] border-[#DCDCDC] border-1' : '',
    outline ? 'bg-white border-[#DCDCDC] border-1' : '',
  ]);

  return (
    <button className={classes} onClick={() => handleClick()} disabled={disabled}>
      {iconLeft && <span className="mr-1">{iconLeft}</span>}
      {text}
      {iconRight && <span className="ml-1">{iconRight}</span>}
    </button>
  );
};

export default PillButtons;
