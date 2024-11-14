import React, { FC, useId } from 'react';

import { TextInputProps } from './types';
import InfoWrapper from '../InfoWrapper';
import { colours, fonts } from '../../tailwind/theme';
import { conditionalStrings } from '../../utils/conditionalStrings';
import FloatingPlaceholder from '../FloatingPlaceholder';

const TextInput: FC<TextInputProps> = ({
  className = '',
  id,
  name,
  isValid = true,
  isDisabled = false,
  value,
  required = false,
  maxLength = 200,
  showCharCount = false,
  onChange,
  onKeyDown,
  placeholder,
  min,
  max,
  label,
  tooltipText,
  message,
  helpText,
}) => {
  const remainingChars = maxLength - (value?.length ?? 0);

  const randomId = useId();
  const elementId = id ?? randomId;
  const helpMessageId = `${elementId}-help`;
  const infoMessageId = `${elementId}-info`;
  const charCountId = `${elementId}-char-count`;

  const getAriaDescribedBy = () => {
    const ids = [];
    if (tooltipText) ids.push(helpMessageId);
    if (message) ids.push(infoMessageId);
    if (showCharCount) ids.push(charCountId);
    return ids.length > 0 ? ids.join(' ') : undefined;
  };

  const inError = !isValid && !isDisabled;
  const isDefault = !inError && !isDisabled;

  const inputClasses = conditionalStrings({
    [`${colours.textOnSurface} bg-transparent w-full rounded px-4 border focus:outline-none pt-6 pb-2 h-[50px] peer`]:
      true,
    [`${colours.borderOnSurfaceOutlineSubtle}`]: isDisabled,
    [`${colours.borderError} `]: inError,
    [`${colours.borderOnSurfaceOutline} focus:border-colour-primary focus:dark:border-colour-primary-dark`]:
      isDefault,
  });

  const labelClasses = conditionalStrings({
    [fonts.bodySmall]: true,
    [`${colours.textOnSurfaceSubtle} focus:text-colour-primary focus:dark:text-colour-primary-dark`]:
      !inError,
    [`${colours.textError}`]: inError,
  });

  const hasValue = !!value;

  return (
    <div className={className}>
      <InfoWrapper htmlFor={elementId} label={label} description={helpText} helpText={tooltipText}>
        <div className="relative h-[50px]">
          <input
            id={elementId}
            className={inputClasses}
            value={value}
            maxLength={maxLength}
            min={min}
            max={max}
            name={name}
            required={required}
            onChange={onChange}
            onKeyDown={onKeyDown}
            disabled={isDisabled}
            aria-invalid={!isValid}
            aria-required={required}
            aria-describedby={getAriaDescribedBy()}
          />
          <FloatingPlaceholder htmlFor={elementId} hasValue={hasValue} isDisabled={isDisabled}>
            {placeholder}
          </FloatingPlaceholder>
        </div>
      </InfoWrapper>

      {message ? (
        <div>
          <label htmlFor={elementId} id={infoMessageId} className={labelClasses}>
            {message}
          </label>
        </div>
      ) : null}

      {showCharCount ? (
        <div id={charCountId} className={labelClasses}>
          {remainingChars} characters remaining
        </div>
      ) : null}
    </div>
  );
};

export default TextInput;
