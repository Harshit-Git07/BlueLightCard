import { ChangeEvent, FC, useId, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faInfoCircle } from '@fortawesome/pro-solid-svg-icons';
import { borders, colours, fonts } from '../../tailwind/theme';
import FloatingPlaceholder from '../FloatingPlaceholder';
import PasswordRequirements from './components/PasswordRequirements';
import { usePasswordValidation } from '../../hooks/usePasswordValidation';

export type Props = {
  onChange: (input: string) => void;
  password: string;
  isValid: boolean | undefined;
  label?: string;
  showIcon?: boolean;
  helpMessage?: string;
  infoMessage?: string;
  hideRequirements?: boolean;
  isDisabled?: boolean;
  placeholderText?: string;
  onBlur?: () => void;
};

const PasswordInput: FC<Props> = ({
  onChange,
  password,
  isValid,
  label = '',
  showIcon = true,
  helpMessage = '',
  infoMessage = '',
  hideRequirements = false,
  isDisabled = false,
  placeholderText = 'Password',
  onBlur,
}) => {
  const { getValidatedPasswordRequirements } = usePasswordValidation();
  const [showPassword, setShowPassword] = useState(false);
  const [isInputDirty, setIsInputDirty] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const componentId = useId();

  const onPasswordFocus = () => {
    setIsFocused(true);
    setShowRequirements(!hideRequirements);
  };

  const onPasswordBlur = () => {
    setIsFocused(false);
    setShowRequirements(false);
    onBlur && onBlur();
  };

  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const passwordInput = e.target.value;
    setIsInputDirty(true);
    onChange(passwordInput);
  };

  const onEyeClick = () => {
    setShowPassword(!isDisabled && !showPassword);
  };

  const getBorderClasses = () => {
    if (isDisabled) {
      return borders.disabled;
    } else if (!isValid && isValid !== undefined) {
      return borders.error;
    } else if (isFocused) {
      return borders.active;
    } else {
      return borders.default;
    }
  };

  const classes = {
    label: `mr-[8px] ${colours.textOnSurface} ${fonts.body}`,
    infoIcon: `h-[14px] w-[14px] ${colours.textOnSurfaceSubtle} ${isDisabled && 'pointer-events-none'}`,
    helpMessage: `mt-[6px] ${colours.textOnSurfaceSubtle} ${fonts.body}`,
    fieldWrapper: `relative mt-[6px]`,
    input: `peer w-full h-[50px] px-[16px] pt-[16px] ${fonts.body} ${isDisabled ? colours.textOnSurfaceDisabled : colours.textOnSurface} ${isDisabled ? colours.backgroundSurfaceContainer : 'bg-transparent'} ${getBorderClasses()}`,
    eyeIconButton: `absolute top-1/2 right-4 -translate-y-1/2 ${isDisabled && 'pointer-events-none'}`,
    eyeIcon: `w-[16px] h-[16px] ${isDisabled ? colours.textOnSurfaceDisabled : colours.textOnSurface}`,
    infoMessage: `mt-[8px] ${isValid ? colours.textSuccess : colours.textError} ${fonts.bodySmall}`,
  };

  return (
    <div>
      <div>
        {label ? (
          <label htmlFor={`password-${componentId}`} className={classes.label} aria-label={label}>
            {label}
          </label>
        ) : null}
        {showIcon && label ? (
          <button type="button" title={`${label} Information`} aria-label={`${label} Information`}>
            {' '}
            <FontAwesomeIcon icon={faInfoCircle} className={classes.infoIcon} />
          </button>
        ) : null}
      </div>

      <p className={classes.helpMessage} id={`helpMessage-${componentId}`}>
        {helpMessage}
      </p>

      <div className={classes.fieldWrapper}>
        <input
          className={`${classes.input}`}
          id={`password-${componentId}`}
          type={showPassword ? 'text' : 'password'}
          onChange={onPasswordChange}
          onFocus={onPasswordFocus}
          onBlur={onPasswordBlur}
          disabled={isDisabled}
          aria-required="true"
          aria-disabled={isDisabled}
          aria-describedby={helpMessage ? `helpMessage-${componentId}` : undefined}
          aria-invalid={isValid === false ? 'true' : undefined}
        />
        <FloatingPlaceholder
          htmlFor={`password-${componentId}`}
          hasValue={!!password}
          isDisabled={isDisabled}
        >
          {placeholderText}
        </FloatingPlaceholder>
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
        <p className={classes.infoMessage} role="alert" aria-live="assertive">
          {infoMessage}
        </p>
      ) : null}

      {showRequirements ? (
        <PasswordRequirements
          validatedRequirements={getValidatedPasswordRequirements(password)}
          isPasswordValid={isValid}
        />
      ) : null}
    </div>
  );
};

export default PasswordInput;
