import { FC, forwardRef, useState } from 'react';
import { InputRadioButtonProps } from './types';

/**
 * **IMPORTANT:** This has been deprecated - please use /packages/shared-ui/src/components/RadioButton/index.tsx
 *
 * @deprecated Please read the above note carefully.
 */
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

/**
 * **IMPORTANT:** This has been deprecated - please use /packages/shared-ui/src/components/RadioButton/index.tsx
 *
 * @deprecated Please read the above note carefully.
 */
// eslint-disable-next-line react/display-name
const InputRadioButtonWithRef = forwardRef<unknown, InputRadioButtonProps>((props, ref) => (
  <InputRadioButton {...props} />
));

/**
 * **IMPORTANT:** This has been deprecated - please use /packages/shared-ui/src/components/RadioInput/index.tsx
 *
 * @deprecated Please read the above note carefully.
 */
export default InputRadioButtonWithRef;
