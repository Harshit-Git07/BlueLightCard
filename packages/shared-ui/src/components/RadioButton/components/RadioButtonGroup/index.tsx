import { FC, SyntheticEvent, useMemo } from 'react';
import RadioButton from '../../index';

export type RadioGroupItem = {
  id: string;
  label?: string;
};

export type RadioGroupItems = RadioGroupItem[];

interface RadioGroupProps {
  disabled?: boolean;
  name: string;
  items: RadioGroupItems;
  onChange?: (e: SyntheticEvent, id?: string) => void;
  value?: string;
  withBorder?: boolean;
}

const RadioGroup: FC<RadioGroupProps> = ({
  items,
  disabled = false,
  name,
  value,
  onChange,
  withBorder = false,
}) => {
  const cleanItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    return items.map(({ id, label }) => {
      return {
        id,
        label: label ?? id,
      };
    });
  }, [items]);

  const onChangeHandler = (e: SyntheticEvent, id?: string) => {
    if (!onChange) return;
    onChange(e, id);
  };

  return (
    <fieldset className={'flex flex-col gap-2'}>
      {cleanItems.map(({ id, label }) => (
        <RadioButton
          key={id}
          id={id}
          name={name}
          disabled={disabled}
          checked={id === value}
          onChange={onChangeHandler}
          withBorder={withBorder}
        >
          {label}
        </RadioButton>
      ))}
    </fieldset>
  );
};

export default RadioGroup;
