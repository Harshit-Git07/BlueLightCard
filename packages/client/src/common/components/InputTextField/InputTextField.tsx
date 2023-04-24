import { FC, forwardRef } from 'react';
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
  success,
  value,
  placeholder,
  maxlength,
  min,
  max,
  required,
  name,
  onChange,
  onKeyDown,
  type = 'text',
  passwordVisible = false,
}) => {
  return (
    <InputFieldWrapper icon={icon} showSuccessState={success} showErrorState={error}>
      <input
        className={`${
          error ? 'border-semantic-danger-base ' : 'focus:border-primary-type-1-base '
        }${
          icon ? 'pl-8 ' : ''
        }w-full rounded-md py-2 px-3 border-neutrals-type-1-400 border focus:outline-none`}
        value={value}
        type={type === 'password' && passwordVisible ? 'text' : type}
        placeholder={placeholder}
        maxLength={maxlength}
        min={min}
        max={max}
        name={name}
        aria-label={name}
        required={required}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </InputFieldWrapper>
  );
};

// eslint-disable-next-line react/display-name
const InputTextFieldWithRef = forwardRef<unknown, InputTextFieldProps>((props, ref) => (
  <InputTextField {...props} _ref={ref} />
));

export default InputTextFieldWithRef;
