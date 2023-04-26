import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation, faCircleCheck } from '@fortawesome/pro-solid-svg-icons';
import { FC } from 'react';
import { InputFieldWrapperProps } from './types';
import { decider } from '@/utils/decider';

const InputSharedWrapper: FC<InputFieldWrapperProps> = ({
  icon,
  showErrorState,
  showSuccessState,
  children,
}) => {
  const color = decider([
    [showErrorState, 'text-semantic-danger-base '],
    [showSuccessState, 'text-semantic-success-base '],
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
          className="-translate-y-1/2 absolute absolute left-3 top-2/4 z-10"
          icon={icon}
          size="sm"
        />
      )}
      {children}
      {_iconRight && (
        <FontAwesomeIcon
          className={`${color}-translate-y-1/2 absolute right-3 top-2/4 z-10`}
          icon={_iconRight}
          aria-label="toggle button"
        />
      )}
    </div>
  );
};

export default InputSharedWrapper;
