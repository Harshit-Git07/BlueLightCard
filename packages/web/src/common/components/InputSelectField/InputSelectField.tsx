import { FC, forwardRef } from 'react';
import InputFieldWrapper from '@/components/_shared/InputFieldWrapper';
import { InputSelectFieldProps, KeyValue } from './types';
import { cssUtil } from '@/utils/cssUtil';

const InputSelectField: FC<InputSelectFieldProps> = ({
  icon,
  options,
  error,
  success,
  value,
  defaultOption,
  onChange,
  tabIndex,
  disabled = false,
}) => {
  const selectClasses = cssUtil([
    error
      ? 'border-border-error dark:border-palette-danger-dark dark:text-font-neutral-dark'
      : 'border-border-base dark:border-palette-neutral-dark focus:border-border-focus bg-palette-white focus:dark:border-border-dark dark:text-font-neutral-dark',
    icon ? 'pl-8' : '',
    'w-full rounded-md py-2 px-3 border focus:outline-none',
  ]);
  return (
    <InputFieldWrapper icon={icon} select={true} showSuccessState={success} showErrorState={error}>
      <select
        aria-label="drop-down selector"
        tabIndex={tabIndex}
        className={selectClasses}
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        {defaultOption && <option>{defaultOption}</option>}
        {options?.map((option: KeyValue) => (
          <option
            aria-label="drop-down option"
            tabIndex={0}
            key={`option_${option.value}`}
            value={option.value}
          >
            {option.text}
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
