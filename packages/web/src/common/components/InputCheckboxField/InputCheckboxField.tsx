import { ChangeEvent, FC, forwardRef, useEffect, useState } from 'react';
import { InputCheckboxFieldProps } from '@/components/InputCheckboxField/types';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/pro-regular-svg-icons';

const InputCheckboxField: FC<InputCheckboxFieldProps> = ({
  id,
  label,
  selectedByDefault,
  onChange,
}) => {
  const defaultChecked = selectedByDefault ? selectedByDefault : false;
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsChecked(!isChecked);
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <div>
      <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
        <input
          id={id}
          className="relative peer appearance-none w-4 h-4 border-2 border-gray-600 rounded-sm bg-transparent shrink-0"
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
        />
        {isChecked && (
          <FontAwesomeIcon
            icon={faCheck}
            color="text-gray-600"
            className="absolute w-2 h-2 p-1 hidden peer-checked:block pointer-events-none"
          ></FontAwesomeIcon>
        )}
        <span>{label}</span>
      </label>
    </div>
  );
};

// eslint-disable-next-line react/display-name
const InputCheckboxFieldWithRef = forwardRef<unknown, InputCheckboxFieldProps>((props, ref) => (
  <InputCheckboxField {...props} _ref={ref} />
));

export default InputCheckboxFieldWithRef;
