import { FC, forwardRef } from 'react';
import InputFieldWrapper from '@/components/_shared/InputFieldWrapper';
import { InputSelectFieldProps, KeyValue } from './Types';

const InputSelectField: FC<InputSelectFieldProps> = ({
  id,
  icon,
  options,
  error,
  success,
  value,
  defaultOption,
  onChange,
  handleSelectedOption,
  tabIndex,
}) => {
  const selectStyleVariants = {
    error:
      'border-semantic-danger-base w-full rounded-md py-2 px-3 border-neutrals-type-1-400 border focus:outline-none ',
    no_error:
      'focus:border-primary-type-1-base w-full rounded-md y-3 py-2 px-3 border-neutrals-type-1-400 border focus:outline-none ',
    icon: 'pl-8 ',
    defaultOptionText: 'text-[#CCCCD6]',
  };

  const sortedOptions = [...options];
  sortedOptions.sort((a, b) => {
    // sort all the elements alphabetically except the 'Other' option
    if (a.value.toLowerCase() === 'other') return 1;
    if (b.value.toLowerCase() === 'other') return -1;

    // otherwise sort normally
    return a.value.localeCompare(b.value);
  });
  return (
    <InputFieldWrapper icon={icon} select={true} showSuccessState={success} showErrorState={error}>
      <select
        id={id}
        aria-label="drop-down selector"
        tabIndex={tabIndex}
        className={
          (icon ? selectStyleVariants.icon : '') +
          (error ? selectStyleVariants.error : selectStyleVariants.no_error)
        }
        value={value}
        onChange={(event) => {
          const selectedKey = event.target.value;

          // Find the selected option from options array
          const selectedOption = options?.find((option) => option.key === selectedKey);

          // Handle the selectedOption
          if (typeof handleSelectedOption === 'function') {
            handleSelectedOption(selectedOption);
          }

          // Call the original onChange handler if it exists
          if (onChange) onChange(event);
        }}
      >
        {defaultOption && <option value="">{defaultOption}</option>}
        {sortedOptions?.map((sortedOptions: KeyValue) => (
          <option
            id={sortedOptions.value}
            aria-label={sortedOptions.value}
            tabIndex={0}
            key={sortedOptions.key}
            value={sortedOptions.key}
          >
            {sortedOptions.value}
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
