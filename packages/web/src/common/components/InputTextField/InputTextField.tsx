import { FC, forwardRef } from 'react';
import { InputTextFieldProps } from './types';
import InputFieldWrapper from '@/components/_shared/InputFieldWrapper';
import { cssUtil } from '@/utils/cssUtil';

/**
 * **IMPORTANT:** This has been deprecated - please use /packages/shared-ui/src/components/TextInput/index.tsx
 *
 * @deprecated Please read the above note carefully.
 */

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
  const inputClasses = cssUtil([
    error
      ? ' border-border-error dark:border-palette-danger-dark '
      : 'border-neutrals-type-1-400 dark:border-palette-neutral-dark bg-palette-white focus:border-border-focus focus:dark:border-border-dark',
    icon ? 'pl-8' : '',
    'w-full rounded-md py-2 px-3 border focus:outline-none',
  ]);
  return (
    <InputFieldWrapper icon={icon} showSuccessState={success} showErrorState={error}>
      <input
        id={name}
        className={inputClasses}
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
