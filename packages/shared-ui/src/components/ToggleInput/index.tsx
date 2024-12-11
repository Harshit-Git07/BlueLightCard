import { ChangeEvent, FC } from 'react';

type ToggleInputProps = {
  id?: string;
  name?: string;
  selected?: boolean;
  disabled?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>, id?: string) => void;
};

// colour definitions
export const toggleStyles = {
  bg: 'bg-colour-surface-inverse dark:bg-colour-surface-inverse-dark',
  bgSelected: 'bg-colour-primary dark:bg-colour-primary-dark',
  bgDisabled: 'bg-colour-surface-container dark:bg-colour-surface-container-dark',
  bgDisabledSelected: 'bg-colour-primary-disabled dark:bg-colour-primary-dark/40',
  notch: 'bg-colour-onSurface-bright-fixed dark:bg-colour-onSurface-bright-fixed-dark',
  notchDisabled: 'bg-colour-onSurface-disabled dark:bg-colour-onSurface-disabled-dark',
  dropShadow: 'shadow-[0px_3px_1px_0px_#0000000F,0px_3px_8px_0px_#00000026]',
};

export const getToggleBg = (selected: boolean, disabled: boolean) => {
  const { bgSelected, bgDisabled, bg, bgDisabledSelected } = toggleStyles;
  const bgCol = selected ? bgSelected : bg;
  if (!disabled) return bgCol;
  if (selected) return bgDisabledSelected;
  return bgDisabled;
};

export const getNotchCol = (disabled: boolean) => {
  const { notchDisabled, notch } = toggleStyles;
  return disabled ? notchDisabled : notch;
};

const ToggleInput: FC<ToggleInputProps> = (props) => {
  const { selected = false, disabled = false, onChange, id, name } = props;
  const { dropShadow } = toggleStyles;

  // colours to use
  const bgCol = getToggleBg(selected, disabled);
  const notchCol = getNotchCol(disabled);

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;

    onChange(e, id);
  };

  return (
    <span className={`inline-flex select-none items-center relative`}>
      <span
        data-testid={'toggle-bg'}
        className={`box block h-[31px] w-[51px] rounded-full ${bgCol}`}
      />
      <span
        data-testid={'toggle-notch'}
        className={`absolute left-[2px] top-[2px] flex h-[27px] w-[27px] items-center justify-center rounded-full ${notchCol} transition ${
          selected ? 'translate-x-[20px]' : ''
        } ${dropShadow}`}
      />
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={selected}
        onChange={onChangeHandler}
        disabled={disabled}
        className={`absolute appearance-none h-[31px] w-[51px] ${disabled ? '' : 'cursor-pointer'}`}
      />
    </span>
  );
};

export default ToggleInput;
