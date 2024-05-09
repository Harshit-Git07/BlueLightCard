import { FC } from 'react';
import { useCSSMerge, useCSSConditional } from '../../hooks/useCSS';
import { PlatformVariant, SharedProps } from '../../types';

export type Props = SharedProps & {
  text: string;
  onSelected: () => void;
  disabled?: boolean;
  outline?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  isSelected?: boolean;
};

const PillButtons: FC<Props> = ({
  text,
  iconLeft,
  iconRight,
  disabled = false,
  onSelected,
  outline,
  isSelected,
  platform,
}) => {
  const handleClick = () => {
    if (!isSelected && !disabled) {
      onSelected();
    }
  };

  const dynCss = useCSSConditional({
    'py-3': platform === PlatformVariant.Desktop,
    'py-2': platform === PlatformVariant.Mobile,
    'bg-[#001B80] text-white': !!isSelected,
    'bg-[#ECEFF2]': !isSelected,
    'cursor-not-allowed bg-white text-[#DCDCDC] border-[#DCDCDC] border-[1px]': !!disabled,
    'bg-white border-[#DCDCDC] border-[1px] border-solid': !!outline,
  });

  // Custom style classes for tailwind purged classes on web or mobile-hybrid
  const customStyleClasses = 'min-w-54';

  const css = useCSSMerge(
    "font-['MuseoSans'] text-[#202125] font-light rounded-full px-3 whitespace-nowrap text-base",
    customStyleClasses,
    dynCss,
  );

  return (
    <button className={css} onClick={() => handleClick()} disabled={disabled}>
      {iconLeft && <span className="mr-1">{iconLeft}</span>}
      {text}
      {iconRight && <span className="ml-1">{iconRight}</span>}
    </button>
  );
};

export default PillButtons;
