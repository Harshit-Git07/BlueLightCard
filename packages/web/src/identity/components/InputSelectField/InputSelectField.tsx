import { FC, forwardRef } from 'react';
import InputFieldWrapper from '@/components/_shared/InputFieldWrapper';
import { InputSelectFieldProps, KeyValue } from './Types';

const InputSelectField: FC<InputSelectFieldProps> = ({
  icon,
  options,
  error,
  success,
  value,
  defaultOption,
  onChange,
  tabIndex,
}) => {
  const selectStyleVariants = {
    error:
      'border-semantic-danger-base w-full rounded-md py-2 px-3 border-neutrals-type-1-400 border focus:outline-none',
    no_error:
      'focus:border-primary-type-1-base w-full rounded-md py-2 px-3 border-neutrals-type-1-400 border focus:outline-none',
    icon: 'pl-8',
  };
  return (
    <InputFieldWrapper icon={icon} select={true} showSuccessState={success} showErrorState={error}>
      <select
        aria-label="drop-down selector"
        tabIndex={tabIndex}
        className={
          (icon ? selectStyleVariants.icon : '') +
          (error ? selectStyleVariants.error : selectStyleVariants.no_error)
        }
        value={value}
        onChange={onChange}
      >
        {defaultOption && <option>{defaultOption}</option>}
        {options?.map((option: KeyValue) => (
          <option aria-label="drop-down option" tabIndex={0} key={option.key} value={option.value}>
            {option.value}
          </option>
        ))}
      </select>
    </InputFieldWrapper>
  );
};

// eslint-disable-next-line react/display-name
const InputSelectFieldWithRef = forwardRef<unknown, InputSelectFieldProps>((props, ref) => (
  <InputSelectField {...props} _ref={ref} />
));

export default InputSelectFieldWithRef;