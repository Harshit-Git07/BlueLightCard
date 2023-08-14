import { FC, forwardRef, useState, ChangeEvent } from 'react';
import { InputRadioButtonsProps } from './types';
import React from 'react';

const InputRadioButton: FC<InputRadioButtonsProps> = ({
  currentSelection,
  inputValues,
  onChange,
  id,
}) => {
  const [selected, setSelected] = useState(currentSelection ?? '');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelected(event.target.value);
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <>
      {inputValues.map((input, index) => (
        <label
          key={`${input.name}_${index}`}
          className={`m-2 border-2 rounded p-2 ${selected == input.value && 'border-border-focus'}`}
        >
          <input
            id={id + '_' + index}
            className="mr-2"
            type="radio"
            name={input.name}
            value={input.value}
            checked={selected === '' ? input.selectedByDefault : selected === input.value}
            onChange={handleInputChange}
          />
          <span className={`${selected == input.value && 'text-palette-primary-base'}`}>
            {input.name}
          </span>
        </label>
      ))}
    </>
  );
};

// eslint-disable-next-line react/display-name
const InputRadioButtons = forwardRef<HTMLInputElement, InputRadioButtonsProps>((props, ref) => (
  <InputRadioButton {...props} />
));

export default InputRadioButtons;
