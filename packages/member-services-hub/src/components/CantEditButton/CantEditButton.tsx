import { ThemeVariant } from '@/app/common/types/theme';
import Button from '../Button/Button';
import { CantEditButtonProps } from './types';
import { FC } from 'react';

const CantEditButton: FC<CantEditButtonProps> = ({ icon, onClick, open }) => {
  return (
    <Button
      variant={ThemeVariant.Tertiary}
      id="edit_modal_button"
      className="h-9 text-center text-shade-greyscale-grey-500 text-sm font-normal font-['Museo Sans'] leading-[20px] tracking-[.07px] py-2 rounded-[5px] justify-end items-center gap-2.5 flex"
      iconRight={icon}
      onClick={() => onClick(!open)}
    >
      Why can&apos;t I edit?
    </Button>
  );
};

export default CantEditButton;
