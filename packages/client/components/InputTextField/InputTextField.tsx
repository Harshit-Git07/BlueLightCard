import { faEye } from '@fortawesome/pro-solid-svg-icons/faEye';
import { faEyeSlash } from '@fortawesome/pro-solid-svg-icons/faEyeSlash';
import { FC, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { InputTextFieldProps } from './types';
import InputFieldWrapper from '@/components/_shared/InputFieldWrapper';
import { createStyledInputField } from '@/components/_shared/StyledInputField';

/**
 * The use of $prop are transient props, see the docs for more
 * https://styled-components.com/docs/api#transient-props
 */

const StyledInputTextField = createStyledInputField(Form.Control);

const InputTextField: FC<InputTextFieldProps> = ({
  icon,
  error,
  value,
  placeholder,
  maxlength,
  min,
  max,
  onChange,
  onKeyDown,
  onTogglePasswordVisible,
  type = 'text',
  passwordVisible = false,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(passwordVisible);
  const passwordToggleIcon = isPasswordVisible ? faEye : faEyeSlash;
  const onRightIconClick = () => {
    setIsPasswordVisible(!isPasswordVisible)
    if (onTogglePasswordVisible) {
      onTogglePasswordVisible(!isPasswordVisible);
    }
  };
  return (
    <InputFieldWrapper
      icon={icon}
      showRightIcon={type === 'password'}
      showSuccessState={!!value}
      iconRight={type === 'password' ? passwordToggleIcon : undefined}
      showErrorState={error}
      onRightIconClick={onRightIconClick}
    >
      <StyledInputTextField
        type={type === 'password' && isPasswordVisible ? 'text' : type}
        $spaceForIcon={!!icon}
        error={error}
        placeholder={placeholder}
        maxLength={maxlength}
        min={min}
        max={max}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </InputFieldWrapper>
  );
};

export default InputTextField;
