import React, { FC, useId, useState } from 'react';

import { TextInputProps } from './types';
import { colours, fonts, getInputBorderClasses } from '../../tailwind/theme';
import FloatingPlaceholder from '../FloatingPlaceholder';
import FieldLabel from '../FieldLabel';
import { floatingPlaceholderInputClasses } from '../FloatingPlaceholder/utils';
import ValidationMessage from '../ValidationMessage';
import { getAriaDescribedBy } from '../../utils/getAriaDescribedBy';

const TextInput: FC<TextInputProps> = ({
  id,
  name,
  isValid = undefined,
  isDisabled = false,
  value,
  isRequired = false,
  maxLength = 200,
  onChange,
  onKeyDown,
  placeholder,
  label,
  tooltip,
  description,
  validationMessage,
}) => {
  const randomId = useId();
  const [isFocused, setIsFocused] = useState(false);

  const componentId = id ?? randomId;
  const ariaDescribedBy = getAriaDescribedBy(
    componentId,
    tooltip,
    description,
    placeholder,
    validationMessage,
  );

  const borderClasses = getInputBorderClasses(isDisabled, isFocused, isValid);

  const classes = {
    input: `w-full px-4 h-[50px] ${floatingPlaceholderInputClasses(!!placeholder)} ${fonts.body} ${
      isDisabled
        ? `${colours.textOnSurfaceDisabled} cursor-not-allowed`
        : `${colours.textOnSurface} cursor-pointer`
    } ${isDisabled ? colours.backgroundSurfaceContainer : 'bg-transparent'} ${borderClasses}`,
  };

  const hasValue = !!value;

  return (
    <div>
      {label ? (
        <FieldLabel
          htmlFor={componentId}
          label={label}
          description={description}
          tooltip={tooltip}
        />
      ) : null}
      <div className="relative h-[50px] w-full">
        <input
          id={componentId}
          className={classes.input}
          value={value}
          maxLength={maxLength}
          name={name}
          required={isRequired}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={isDisabled}
          aria-invalid={!isValid}
          aria-required={isRequired}
          aria-describedby={ariaDescribedBy}
        />
        {placeholder ? (
          <FloatingPlaceholder
            htmlFor={componentId}
            hasValue={hasValue}
            isDisabled={isDisabled}
            text={placeholder}
          />
        ) : null}
      </div>

      <ValidationMessage
        message={validationMessage}
        htmlFor={componentId}
        isValid={isValid}
        isDisabled={isDisabled}
      />
    </div>
  );
};

export default TextInput;
