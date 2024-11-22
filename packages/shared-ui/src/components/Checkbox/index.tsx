import { ChangeEvent, FC, useId } from 'react';
import { conditionalStrings } from '../../utils/conditionalStrings';
import CheckBoxInput from './CheckBoxInput';

export type Props = {
  id?: string;
  name?: string;
  value?: string;
  variant?: 'Default' | 'withBorder';
  isDisabled: boolean;
  checkboxText?: string;
  isChecked?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

const Checkbox: FC<Props> = ({
  id,
  name,
  value,
  variant = 'Default',
  isDisabled,
  checkboxText,
  isChecked = false,
  onChange,
}) => {
  const hasBorder = variant === 'withBorder';

  const borderCss = conditionalStrings({
    'px-4 py-2 rounded border border-1': hasBorder,
  });

  const variantCss = conditionalStrings({
    'border-colour-onSurface-disabled dark:border-colour-onSurface-disabled-dark':
      hasBorder && isDisabled && !isChecked,
    'border-colour-onSurface-outline dark:border-colour-onSurface-outline-dark':
      hasBorder && !isDisabled && !isChecked,
    'border-colour-primary-disabled dark:border-colour-primary-disabled-dark':
      hasBorder && isDisabled && isChecked,
    'border-colour-primary dark:border-colour-primary-dark': hasBorder && !isDisabled && isChecked,
  });

  const labelCss = conditionalStrings({
    'text-colour-primary dark:text-colour-primary-dark': !isDisabled && isChecked,
    'text-colour-onSurface dark:text-colour-onSurface-dark': !isDisabled,
    'text-colour-primary-disabled dark:text-colour-primary-disabled-dark': isDisabled && isChecked,
    'text-colour-onSurface-disabled dark:text-colour-onSurface-disabled-dark': isDisabled,
  });

  const randomId = useId();
  const htmlFor = id ?? randomId;

  return (
    <div
      className={`
        flex items-center relative
          ${borderCss}
          ${variantCss}
      `}
      aria-describedby={htmlFor}
    >
      <CheckBoxInput
        id={htmlFor}
        name={name}
        value={value}
        isChecked={isChecked}
        isDisabled={isDisabled}
        onChange={onChange}
      />

      {checkboxText ? (
        <label
          htmlFor={htmlFor}
          className={`
            ${labelCss}
            ms-2 font-typography-body font-typography-body-weight text-typography-body leading-typography-body
        `}
        >
          {checkboxText}
        </label>
      ) : null}
    </div>
  );
};

export default Checkbox;
