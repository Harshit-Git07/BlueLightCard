import React, { FC, forwardRef, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/pro-solid-svg-icons';

import { TextInputProps, TextInputState } from './types';

type Props = TextInputProps;

const getInputLabelClasses = (state: TextInputState) => {
  switch (state) {
    case 'Active':
      return 'border-colour-primary dark:border-colour-primary-dark';
    case 'Error':
      return 'border-colour-onError-container dark:border-colour-onError-container-dark';
    case 'Disabled':
      return 'placeholder-colour-onSurface-disabled dark:placeholder-colour-onSurface-disabled-dark bg-colour-surface-container dark:bg-colour-surface-container-dark';
    default:
      return 'border-colour-onSurface-outline dark:border-colour-onSurface-outline-dark bg-palette-white';
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
  name,
  state = 'Default',
  value,
  required = false,
  maxChars = 100,
  _ref,
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
}) => {
  const [inputState, setInputState] = useState<TextInputState>(state);

  useEffect(() => {
    if (value) {
      if (value.length > 0) {
        setInputState('Filled');
      } else {
        setInputState(state);
      }
    } else {
      setInputState(state);
    }
  }, [value, state]);

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

  const getAriaDescribedBy = () => {
    const ids = [];
    if (showHelpMessage && helpMessage) ids.push(helpMessageId);
    if (showInfoMessage && infoMessage) ids.push(infoMessageId);
    return ids.length > 0 ? ids.join(' ') : undefined;
  };

  return (
    <div className="space-y-2">
      {(showLabel || showIcon) && (
        <div className="flex items-center gap-2">
          {showLabel && (
            <label className="text-colour-onSurface dark:text-colour-onSurface-dark font-typography-body text-typography-body font-typography-body-weight leading-typography-body tracking-typography-body">
              {label}
            </label>
          )}
          {showIcon && (
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

      <div className="relative">
        <input
          id={name}
          className={`w-full rounded-md py-2 px-3 ${getInputLabelClasses(inputState)} border focus:outline-none text-colour-onSurface dark:text-colour-onSurface-dark placeholder-colour-onSurface-subtle dark:placeholder-colour-onSurface-subtle-dark`}
          value={value}
          placeholder={inputState === 'Active' ? '' : placeholder}
          maxLength={maxChars}
          min={min}
          max={max}
          name={name}
          aria-label={name}
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
        {inputState === 'Active' && (
          <label
            htmlFor={name}
            className="absolute left-3 -top-2 bg-white dark:bg-gray-800 px-1 transition-all duration-200 pointer-events-none text-colour-onSurface-subtle dark:text-colour-onSurface-subtle-dark font-typography-body-small font-typography-body-small-weight text-typography-body-small leading-typography-body-small leading-typography-body tracking-typography-body"
          >
            {placeholder}
          </label>
        )}
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
    </div>
  );
};

// eslint-disable-next-line react/display-name
const TextInputWithRef = forwardRef<unknown, Props>((props, ref) => (
  <TextInput {...props} _ref={ref} />
));

export default TextInputWithRef;
