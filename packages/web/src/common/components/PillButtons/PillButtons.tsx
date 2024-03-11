import React, { FC, useState } from 'react';
import { PillButtonProps } from './types';
import { cssUtil } from '@/utils/cssUtil';

const PillButtons: FC<PillButtonProps> = ({
  text,
  iconLeft,
  iconRight,
  disabled,
  onSelected,
  outline,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);

  const handleClick = () => {
    if (!disabled) {
      setIsActive(!isActive);
      onSelected();
    }
    if (outline) {
      setIsActive(isActive);
      onSelected();
    }
  };

  const classes = cssUtil([
    isActive ? 'bg-[#001B80] text-white' : 'bg-[#ECEFF2]',
    `font-['MuseoSans'] text-[#202125] font-light rounded-[56px] py-2 px-3 mobile:py-2 whitespace-nowrap text-base `,
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
