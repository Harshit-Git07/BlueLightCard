import React, { FC, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/pro-solid-svg-icons';

import { TextInputProps, TextInputState } from './types';

const getInputClasses = (state: TextInputState) => {
  const baseClasses = 'w-full rounded-md px-4 border focus:outline-none pt-6 pb-2';

  switch (state) {
    case 'Active':
    case 'Filled':
      return `${baseClasses} border-colour-primary dark:border-colour-primary-dark bg-transparent`;
    case 'Error':
      return `${baseClasses} border-colour-error dark:border-colour-error bg-transparent`;
    case 'Disabled':
      return `${baseClasses} bg-colour-surface-container border-colour-onSurface-outline-subtle dark:bg-colour-surface-container-dark dark:border-colour-onSurface-outline-subtle-dark`;
    default:
      return `${baseClasses} border-colour-onSurface-outline dark:border-colour-onSurface-outline-dark bg-transparent`;
  }
};

const getPlaceholderClasses = (state: TextInputState) => {
  const baseClasses = 'absolute left-4 transition-all duration-200 pointer-events-none';
  const activeClasses =
    'font-typography-label font-typography-label-weight text-typography-label leading-typography-label top-2';
  const inactiveClasses =
    'font-typography-body font-typography-body-weight text-typography-body leading-typography-body top-1/2 -translate-y-1/2';

  switch (state) {
    case 'Active':
    case 'Filled':
      return `${baseClasses} ${activeClasses} text-colour-onSurface-subtle dark:text-colour-onSurface-subtle-dark`;
    case 'Disabled':
      return `${baseClasses} ${inactiveClasses} text-colour-onSurface-disabled dark:text-colour-onSurface-disabled-dark`;
    default:
      return `${baseClasses} ${inactiveClasses} text-colour-onSurface-subtle dark:text-colour-onSurface-subtle-dark`;
  }
};

const getMessageLabelClasses = (state: TextInputState) => {
  switch (state) {
    case 'Active':
      return 'text-colour-primary-light dark:text-colour-primary-dark';
    case 'Error':
      return 'text-colour-error dark:text-colour-error-dark';
    default:
      return 'text-colour-onSurface-subtle dark:text-colour-onSurface-subtle-dark';
  }
};

const TextInput: FC<TextInputProps> = ({
  id,
  name,
  state = 'Default',
  value,
  required = false,
  maxChars = 200,
  showCharCount,
  onChange,
  onKeyDown,
  placeholder,
  min,
  max,
  label,
  showLabel = false,
  showIcon = false,
  helpMessage,
  showHelpMessage = false,
  infoMessage,
  showInfoMessage = false,
  ariaLabel,
}) => {
  const [inputState, setInputState] = useState<TextInputState>(state);
  const remainingChars = maxChars - (value?.length ?? 0);

  useEffect(() => {
    setInputState(state);
  }, [state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxChars) {
      if (onChange) {
        onChange(e);
      }
    }
  };

  const handleFocus = () => {
    setInputState('Active');
  };

  const handleBlur = () => {
    if (value && value.length > 0) {
      setInputState('Filled');
    } else {
      setInputState(state);
    }
  };

  const helpMessageId = `${name}-help`;
  const infoMessageId = `${name}-info`;
  const charCountId = `${name}-char-count`;

  const getAriaDescribedBy = () => {
    const ids = [];
    if (showHelpMessage && helpMessage) ids.push(helpMessageId);
    if (showInfoMessage && infoMessage) ids.push(infoMessageId);
    if (showCharCount) ids.push(charCountId);
    return ids.length > 0 ? ids.join(' ') : undefined;
  };

  return (
    <div className="space-y-2">
      {showLabel && (
        <div className="flex items-center gap-2">
          {showLabel && (
            <label
              htmlFor={id ?? name}
              aria-label={ariaLabel}
              className="text-colour-onSurface dark:text-colour-onSurface-dark font-typography-body text-typography-body font-typography-body-weight leading-typography-body tracking-typography-body"
            >
              {label}
            </label>
          )}
          {showIcon && showLabel && (
            <FontAwesomeIcon
              className="text-colour-onSurface-subtle dark:text-colour-onSurface-subtle-dark"
              icon={faCircleInfo}
            />
          )}
        </div>
      )}

      {showHelpMessage && helpMessage && (
        <div
          id={helpMessageId}
          className="text-colour-onSurface-subtle dark:text-colour-onSurface-subtle-dark font-typography-body text-typography-body font-typography-body-weight leading-typography-body tracking-typography-body"
        >
          {helpMessage}
        </div>
      )}

      <div className="relative h-[50px]">
        <input
          id={id ?? name}
          className={`${getInputClasses(inputState)} text-colour-onSurface dark:text-colour-onSurface-dark h-full`}
          value={value}
          maxLength={maxChars}
          min={min}
          max={max}
          name={name}
          required={required}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={inputState === 'Disabled'}
          aria-invalid={state === 'Error'}
          aria-required={required}
          aria-describedby={getAriaDescribedBy()}
        />
        <span className={getPlaceholderClasses(inputState)}>{placeholder}</span>
      </div>

      {showInfoMessage && infoMessage && (
        <div>
          <label
            id={infoMessageId}
            className={`font-typography-body-small font-typography-body-small-weight text-typography-body-small leading-typography-body-small ${getMessageLabelClasses(inputState)}`}
          >
            {infoMessage}
          </label>
        </div>
      )}
      {showCharCount && (
        <div
          id={charCountId}
          className={`font-typography-body-small font-typography-body-small-weight text-typography-body-small leading-typography-body-small ${getMessageLabelClasses(inputState)}`}
        >
          {remainingChars} characters remaining
        </div>
      )}
    </div>
  );
};

export default TextInput;
