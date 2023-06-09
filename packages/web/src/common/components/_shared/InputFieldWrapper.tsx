import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation, faCircleCheck } from '@fortawesome/pro-solid-svg-icons';
import { FC } from 'react';
import { InputFieldWrapperProps } from './types';
import { decider } from '@/utils/decider';

const InputSharedWrapper: FC<InputFieldWrapperProps> = ({
  icon,
  showErrorState,
  showSuccessState,
  select,
  children,
}) => {
  const color = decider([
    [showErrorState, 'text-palette-danger-base dark:text-palette-danger-dark '],
    [showSuccessState, 'text-palette-success-base dark:text-palette-success-dark '],
    [!showErrorState && !showSuccessState, ''],
  ]);
  const _iconRight = decider([
    [showSuccessState, faCircleCheck],
    [showErrorState, faCircleExclamation],
  ]);
  return (
    <div className="relative">
      {icon && (
        <FontAwesomeIcon
          className="-translate-y-1/2 absolute left-3 top-2/4 z-10"
          icon={icon}
          size="sm"
        />
      )}
      {children}
      {_iconRight && (
        <FontAwesomeIcon
          className={`${
            select ? 'pr-5 ' : ''
          }${color}-translate-y-1/2 absolute right-4 top-2/4 z-10`}
          icon={_iconRight}
          aria-label="toggle button"
        />
      )}
    </div>
  );
};

export default InputSharedWrapper;
