import { FC } from 'react';
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
  value,
  options,
  error,
  defaultOption,
}) => {
  return (
    <InputFieldWrapper icon={icon} showSuccessState={!!value} showErrorState={error}>
      <StyledInputSelectField $spaceForIcon={!!icon} error={error}>
        {defaultOption && <option>{defaultOption}</option>}
        {Object.keys(options).map((value) => (
          <option key={value} value={value}>
            {options[value]}
          </option>
        ))}
      </StyledInputSelectField>
    </InputFieldWrapper>
  );
};

export default InputSelectField;
