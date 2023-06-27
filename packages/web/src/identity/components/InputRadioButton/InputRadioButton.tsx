import { FC, forwardRef, useState } from 'react';
import { InputRadioButtonProps } from './types';
import React from 'react';

const InputRadioButton: FC<InputRadioButtonProps> = ({
  value,
  required,
  name,
  onChange,
  selectedByDefault,
}) => {
  const [selected, setSelected] = useState(selectedByDefault);
  return (
    <>
      <input
        id={name}
        value={value}
        name={name}
        aria-label={name}
        required={required}
        type="radio"
        onClick={(e) => setSelected(!selected)}
        checked={selected}
        onChange={(e) => {}}
      />
      <label className="m-2">{name}</label>
    </>
  );
};

// eslint-disable-next-line react/display-name
const InputRadioButtonWithRef = forwardRef<unknown, InputRadioButtonProps>((props, ref) => (
  <InputRadioButton {...props} />
));

export default InputRadioButtonWithRef;
