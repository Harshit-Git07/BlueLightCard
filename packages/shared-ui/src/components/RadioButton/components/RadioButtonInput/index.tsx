import { FC, SyntheticEvent } from 'react';
import { conditionalStrings } from '../../../../utils/conditionalStrings';

interface RadioButtonInputProps {
  id?: string;
  name?: string;
  checked?: boolean;
  onChange?: (e: SyntheticEvent, id?: string) => void;
  disabled?: boolean;
  value?: string;
}

const getClasses = (checked: boolean, disabled: boolean) => {
  const allStates = true;
  const defaultState = !checked && !disabled;
  const checkedState = checked && !disabled;
  const disabledState = !checked && disabled;
  const checkedDisabledState = checked && disabled;

  return conditionalStrings({
    'appearance-none box relative inline-block h-4 w-4 min-w-4 rounded-full border before:absolute before:left-0.5 before:top-0.5 before:w-2.5 before:h-2.5 before:rounded-full':
      allStates,
    'border-colour-onSurface dark:border-colour-onSurface-dark cursor-pointer': defaultState,
    'border-colour-primary dark:border-colour-primary-dark before:bg-colour-primary dark:before:bg-colour-primary-dark cursor-pointer':
      checkedState,
    'border-colour-onSurface-disabled dark:border-colour-onSurface-disabled-dark': disabledState,
    'border-colour-primary-disabled dark:border-colour-primary-disabled-dark before:bg-colour-primary-disabled dark:before:bg-colour-primary-disabled-dark':
      checkedDisabledState,
  });
};

const RadioButtonInput: FC<RadioButtonInputProps> = ({
  id,
  name,
  checked = false,
  onChange,
  disabled = false,
  value,
}) => {
  const classes = getClasses(checked, disabled);

  const onChangeHandler = (e: SyntheticEvent) => {
    if (!onChange) return;

    onChange(e, id);
  };

  return (
    <input
      type={'radio'}
      id={id}
      name={name}
      checked={checked}
      className={classes}
      disabled={disabled}
      onChange={onChangeHandler}
      value={value}
    />
  );
};

export default RadioButtonInput;
