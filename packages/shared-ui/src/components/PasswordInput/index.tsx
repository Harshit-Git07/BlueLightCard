import { ChangeEvent, FC, useId, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/pro-solid-svg-icons';
import { colours, fonts, getInputBorderClasses } from '../../tailwind/theme';
import FloatingPlaceholder from '../FloatingPlaceholder';
import PasswordRequirements from './components/PasswordRequirements';
import { usePasswordValidation } from '../../hooks/usePasswordValidation';
import { FieldProps } from '../../types';
import FieldLabel from '../FieldLabel';
import { floatingPlaceholderInputClasses } from '../FloatingPlaceholder/utils';
import ValidationMessage from '../ValidationMessage';

export type Props = FieldProps & {
  hideRequirements?: boolean;
};

const PasswordInput: FC<Props> = ({
  id,
  onChange,
  value = '',
  isValid = undefined,
  label,
  tooltip,
  description,
  validationMessage,
  placeholder,
  isDisabled = false,
  hideRequirements = false,
}) => {
  const { getValidatedPasswordRequirements } = usePasswordValidation();
  const [showPassword, setShowPassword] = useState(false);
  const [isInputDirty, setIsInputDirty] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const randomId = useId();
  const componentId = id ?? randomId;
  const inputId = `password-${componentId}`;

  const onPasswordFocus = () => {
    setIsFocused(true);
    setShowRequirements(!hideRequirements);
  };

  const onPasswordBlur = () => {
    setIsFocused(false);
    setShowRequirements(false);
  };

  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsInputDirty(true);
    onChange && onChange(e);
  };

  const onEyeClick = () => {
    setShowPassword(!isDisabled && !showPassword);
  };

  const borderClasses = getInputBorderClasses(isDisabled, isFocused, isValid);

  const classes = {
    fieldWrapper: `relative`,
    input: `w-full h-[50px] px-4 ${floatingPlaceholderInputClasses(!!placeholder)} ${fonts.body} ${
      isDisabled ? colours.textOnSurfaceDisabled : colours.textOnSurface
    } ${isDisabled ? colours.backgroundSurfaceContainer : 'bg-transparent'} ${borderClasses} disabled:cursor-not-allowed`,
    eyeIconButton: `absolute top-1/2 right-4 -translate-y-1/2 ${
      isDisabled && 'pointer-events-none'
    }`,
    eyeIcon: `w-4 h-4 ${isDisabled ? colours.textOnSurfaceDisabled : colours.textOnSurface}`,
  };

  return (
    <div>
      <FieldLabel label={label} description={description} tooltip={tooltip} htmlFor={inputId} />
      <div className={classes.fieldWrapper}>
        <input
          className={`${classes.input}`}
          id={inputId}
          name={inputId}
          aria-label={inputId}
          value={value}
          type={showPassword ? 'text' : 'password'}
          onChange={onPasswordChange}
          onFocus={onPasswordFocus}
          onBlur={onPasswordBlur}
          disabled={isDisabled}
          aria-required="true"
          aria-disabled={isDisabled}
          aria-describedby={description ? `description-${componentId}` : undefined}
          aria-invalid={isValid === undefined ? undefined : !isValid}
        />
        {placeholder ? (
          <FloatingPlaceholder
            htmlFor={inputId}
            hasValue={!!value}
            isDisabled={isDisabled}
            text={placeholder}
          />
        ) : null}

        <button
          type="button"
          className={classes.eyeIconButton}
          onClick={onEyeClick}
          title={showPassword ? 'Hide password' : 'Show password'}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          <FontAwesomeIcon className={classes.eyeIcon} icon={showPassword ? faEyeSlash : faEye} />
        </button>
      </div>

      {isInputDirty ? (
        <ValidationMessage
          message={validationMessage}
          htmlFor={inputId}
          isValid={isValid}
          isDisabled={isDisabled}
        />
      ) : null}

      {showRequirements ? (
        <PasswordRequirements
          validatedRequirements={getValidatedPasswordRequirements(value)}
          isPasswordValid={isValid}
        />
      ) : null}
    </div>
  );
};

export default PasswordInput;
