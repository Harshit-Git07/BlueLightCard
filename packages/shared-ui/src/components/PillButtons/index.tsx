import { FC, KeyboardEvent } from 'react';
import { useCSSMerge, useCSSConditional } from '../../hooks/useCSS';
import { PlatformVariant, SharedProps } from '../../types';

export type Props = SharedProps & {
  text: string;
  tabIndex?: number;
  onSelected: () => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  disabled?: boolean;
  outline?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  isSelected?: boolean;
};

const PillButtons: FC<Props> = ({
  text,
  tabIndex = 0,
  iconLeft,
  iconRight,
  disabled = false,
  onSelected,
  onKeyDown,
  outline,
  isSelected,
  platform,
}) => {
  const handleClick = () => {
    if (!isSelected && !disabled) {
      onSelected();
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!onKeyDown) return;

    onKeyDown(event);
  };

  const dynamicCss = useCSSConditional({
    'py-3': platform === PlatformVariant.Web,
    'py-2': platform === PlatformVariant.MobileHybrid,
    'bg-pill-default-bg-colour-light dark:bg-pill-default-bg-colour-dark text-pill-default-label-colour-light dark:text-pill-default-label-colour-dark':
      !isSelected && !disabled && !outline,
    'bg-pill-selected-bg-colour-light dark:bg-pill-selected-bg-colour-dark text-pill-selected-label-colour-light dark:text-pill-selected-label-colour-dark':
      !!isSelected,
    'cursor-not-allowed text-pill-disabled-label-colour-light dark:text-pill-disabled-label-colour-dark border-pill-disabled-border-colour-light dark:border-pill-disabled-border-colour-dark border-[1px]':
      !!disabled,
    'border-pill-outline-border-colour-light dark:border-pill-outline-border-colour-dark text-pill-outline-label-colour-light dark:text-pill-outline-label-colour-dark border-[1px] border-solid':
      !!outline,
  });

  const generalCss = useCSSMerge(
    'font-pill-label-font text-pill-label-font font-pill-label-font-weight tracking-pill-label-font leading-pill-label-font rounded-full px-3 whitespace-nowrap min-w-[54px]',
    dynamicCss,
  );

  return (
    <button
      tabIndex={tabIndex}
      className={generalCss}
      onClick={() => handleClick()}
      onKeyDown={handleKeyDown}
      disabled={disabled}
    >
      {iconLeft && <span className="mr-1">{iconLeft}</span>}
      {text}
      {iconRight && <span className="ml-1">{iconRight}</span>}
    </button>
  );
};

export default PillButtons;
