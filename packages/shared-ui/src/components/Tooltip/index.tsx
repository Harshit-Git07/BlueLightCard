import { FC } from 'react';
import { conditionalStrings } from '../../utils/conditionalStrings';
import { useCSSMerge } from '../../hooks/useCSS';

export type Props = {
  children: React.ReactNode;
  text: string;
  htmlFor: string;
  position: 'top' | 'bottom' | 'right' | 'left';
  isMaxWidth?: boolean;
  isOpen?: boolean;
};

const Tooltip: FC<Props> = ({ children, text, htmlFor, position, isOpen, isMaxWidth = false }) => {
  const squareWidthCss = conditionalStrings({
    'w-60': isMaxWidth,
    'w-max': !isMaxWidth,
  });

  const squarePositionCss = conditionalStrings({
    'left-full top-1/2 z-50 ml-3 -translate-y-1/2': position === 'right',
    'bottom-full left-1/2 z-50 mb-3 -translate-x-1/2': position === 'top',
    'right-full top-1/2 z-50 mr-3 -translate-y-1/2': position === 'left',
    'left-1/2 top-full z-50 mt-3 -translate-x-1/2': position === 'bottom',
  });

  const squareCss = useCSSMerge(
    squareWidthCss,
    squarePositionCss,
    'transition-opacity ease-in pointer-events-none',
    `max-w-60 text-center rounded px-4 py-[6px] ${
      !isOpen && 'opacity-0'
    } group-hover:opacity-100 absolute`,
    'bg-colour-surface-inverse dark:bg-colour-surface-inverse-dark dark:text-colour-onSurface text-colour-onSurface-dark',
    'font-typography-body-small font-typography-body-small-weight text-typography-body-small leading-typography-body-small',
  );

  const caretPositionCss = conditionalStrings({
    'absolute left-[-3px] top-1/2 -z-10 h-2 w-2 -translate-y-1/2': position === 'right',
    'absolute bottom-[-3px] left-1/2 -z-10 h-2 w-2 -translate-x-1/2': position === 'top',
    'absolute right-[-3px] top-1/2 -z-10 h-2 w-2 -translate-y-1/2': position === 'left',
    'absolute left-1/2 top-[-3px] -z-10 h-2 w-2 -translate-x-1/2': position === 'bottom',
  });

  const caretCss = useCSSMerge(
    'bg-colour-surface-inverse dark:bg-colour-surface-inverse-dark rotate-45 rounded-sm',
    caretPositionCss,
  );

  return (
    <div className="group relative inline-block">
      {children}
      <div id={`${htmlFor}-tooltip`} role="tooltip" aria-label={text} className={squareCss}>
        <span className={caretCss}></span>
        {text}
      </div>
    </div>
  );
};

export default Tooltip;
