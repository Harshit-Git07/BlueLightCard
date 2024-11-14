import React, { FC, ReactNode } from 'react';
import { colours, fonts } from '../../tailwind/theme';
import { conditionalStrings } from '../../utils/conditionalStrings';

export type FloatingPlaceholderProps = {
  htmlFor: string;
  children: ReactNode;
  hasValue: boolean;
  isDisabled?: boolean;
};

const peerFocusBodyLight = [
  'peer-focus:font-typography-body-light',
  'peer-focus:font-typography-body-light-weight',
  'peer-focus:text-typography-body-light',
  'peer-focus:leading-typography-body-light',
  'peer-focus:tracking-typography-body-light',
].join(' ');

const FloatingPlaceholder: FC<FloatingPlaceholderProps> = ({
  htmlFor,
  hasValue,
  children,
  isDisabled = false,
}) => {
  const placeHolderClasses = conditionalStrings({
    ['left-4 -translate-y-1/2 absolute transition-all pointer-events-none']: true,
    [`top-[25px] peer-focus:top-4 ${fonts.body} ${peerFocusBodyLight} peer-focus:text-xs`]:
      !hasValue,
    [`top-4 text-xs ${fonts.bodyLight}`]: hasValue,
    [colours.textOnSurfaceDisabled]: isDisabled,
    [colours.textOnSurfaceSubtle]: !isDisabled,
  });
  return (
    <label
      htmlFor={htmlFor}
      className={placeHolderClasses}
      aria-disabled={isDisabled}
      aria-hidden={isDisabled}
    >
      {children}
    </label>
  );
};

export default FloatingPlaceholder;
