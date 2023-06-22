import { FC, forwardRef, useState, ChangeEvent } from 'react';
import { InputRadioButtonsProps } from './Types';

const InputRadioButton: FC<InputRadioButtonsProps> = ({ inputValues, onChange }) => {
  const [selected, setSelected] = useState('');

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
          className={`m-2 border-2 rounded p-2 ${selected == input.value && 'border-[#009]'}`}
        >
          <input
            className="mr-2"
            type="radio"
            name={input.name}
            value={input.value}
            checked={selected === '' ? input.selectedByDefault : selected === input.value}
            onChange={handleInputChange}
          />
          <span className={`${selected == input.value && 'text-[#009]'}`}>{input.name}</span>
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
