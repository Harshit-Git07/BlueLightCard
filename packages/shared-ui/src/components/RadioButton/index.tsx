import { FC, ReactNode, SyntheticEvent } from 'react';
import RadioButtonInput from './components/RadioButtonInput/index';
import { conditionalStrings } from '../../utils/conditionalStrings';

type RadioButtonProps = {
  children?: ReactNode;
  id?: string;
  name?: string;
  checked?: boolean;
  onChange?: (e: SyntheticEvent, id?: string) => void;
  withBorder?: boolean;
  disabled?: boolean;
};

const getClasses = (checked: boolean, disabled: boolean, withBorder: boolean) => {
  const allStates = true;
  const defaultState = !checked && !disabled;
  const checkedState = checked && !disabled;
  const disabledState = !checked && disabled;
  const checkedDisabledState = checked && disabled;

  const labelClasses = conditionalStrings({
    'inline-flex items-center cursor-pointer': allStates,
    'border rounded px-4 py-2 my-2': withBorder,
    'border-colour-onSurface-outline dark:border-colour-onSurface-outline-dark': defaultState,
    'border-colour-primary dark:border-colour-primary-dark': checkedState,
    'border-colour-onSurface-disabled dark:border-colour-onSurface-disabled-dark': disabledState,
    'border-colour-primary-disabled dark:border-colour-primary-disabled-dark': checkedDisabledState,
  });

  const contentClasses = conditionalStrings({
    'font-typography-body font-typography-body-weight text-typography-body leading-typography-body':
      allStates,
    'text-colour-onSurface dark:text-colour-onSurface-dark': defaultState,
    'text-colour-primary dark:text-colour-primary-dark': checkedState,
    'text-colour-onSurface-disabled dark:text-colour-onSurface-disabled-dark ': disabledState,
    'text-colour-primary-disabled dark:text-colour-primary-disabled-dark': checkedDisabledState,
  });
  return { labelClasses, contentClasses };
};

const RadioButton: FC<RadioButtonProps> = ({
  children,
  id,
  name,
  onChange,
  checked = false,
  withBorder = false,
  disabled = false,
}) => {
  const { labelClasses, contentClasses } = getClasses(checked, disabled, withBorder);

  const onChangeHandler = (e: SyntheticEvent) => {
    if (!onChange) return;
    onChange(e, id);
  };

  return (
    <div>
      <label htmlFor={id} className={labelClasses}>
        <RadioButtonInput
          id={id}
          name={name}
          onChange={onChangeHandler}
          checked={checked}
          disabled={disabled}
        />
        <span className={'pl-2'}>
          {typeof children === 'string' ? (
            <span className={contentClasses} data-testid={'label-content'}>
              {children}
            </span>
          ) : (
            children
          )}
        </span>
      </label>
    </div>
  );
};

export default RadioButton;
