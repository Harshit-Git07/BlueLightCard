import { FC, forwardRef } from 'react';
import InputFieldWrapper from '@/components/_shared/InputFieldWrapper';
import { Form } from 'react-bootstrap';
import { InputSelectFieldProps } from './types';
import { createStyledInputField } from '@/components/_shared/StyledInputField';

/**
 * The use of $prop are transient props, see the docs for more
 * https://styled-components.com/docs/api#transient-props
 */

const StyledInputSelectField = createStyledInputField(Form.Select);

const InputSelectField: FC<InputSelectFieldProps> = ({
  icon,
  options,
  error,
  success,
  value,
  defaultOption,
  required,
  _ref,
  onChange,
}) => {
  return (
    <InputFieldWrapper icon={icon} showSuccessState={success} showErrorState={error}>
      <StyledInputSelectField
        $spaceForIcon={!!icon}
        $error={error}
        required={required}
        value={value}
        ref={_ref}
        onChange={onChange}
      >
        {defaultOption && <option value="">{defaultOption}</option>}
        {Object.keys(options).map((value) => (
          <option key={value} value={value}>
            {options[value]}
          </option>
        ))}
      </StyledInputSelectField>
    </InputFieldWrapper>
  );
};

// eslint-disable-next-line react/display-name
const InputSelectFieldWithRef = forwardRef<unknown, InputSelectFieldProps>((props, ref) => (
  <InputSelectField {...props} _ref={ref} />
));

export default InputSelectFieldWithRef;
