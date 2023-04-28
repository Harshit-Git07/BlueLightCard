import { FC, forwardRef } from 'react';
import InputFieldWrapper from '@/components/_shared/InputFieldWrapper';
import { InputSelectFieldProps } from './types';

const InputSelectField: FC<InputSelectFieldProps> = ({
  icon,
  options,
  error,
  success,
  value,
  defaultOption,
  onChange,
}) => {
  return (
    <InputFieldWrapper icon={icon} select={true} showSuccessState={success} showErrorState={error}>
      <select
        className={`${
          error ? 'border-semantic-danger-base ' : 'focus:border-primary-type-1-base '
        }${
          icon ? 'pl-8 ' : ''
        }w-full rounded-md py-2 px-3 border-neutrals-type-1-400 border focus:outline-none`}
        value={value}
        onChange={onChange}
      >
        {defaultOption && <option>{defaultOption}</option>}
        {Object.keys(options).map((value) => (
          <option key={value} value={value}>
            {options[value]}
          </option>
        ))}
      </select>
    </InputFieldWrapper>
  );
};

// eslint-disable-next-line react/display-name
const InputSelectFieldWithRef = forwardRef<unknown, InputSelectFieldProps>((props) => (
  <InputSelectField {...props} />
));

export default InputSelectFieldWithRef;
