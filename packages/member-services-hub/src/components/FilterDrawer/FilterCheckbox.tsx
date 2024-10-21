import { FC, useState } from 'react';
import { FilterDrawerCheckboxProps } from './types';

const Checkbox: FC<FilterDrawerCheckboxProps> = ({ id, label }) => {
  const [checked, setChecked] = useState(false);
  const handleChange = () => {
    setChecked(!checked);
  };
  return (
    <label className="flex items-center cursor-pointer select-none text-dark text-xs">
      <div className="relative">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          className="sr-only"
        />
        <div className="box mr-4 flex h-4 w-4 items-center justify-center rounded border-stroke dark:border-dark-3 border">
          <span className={`dot h-2 w-2 rounded-sm ${checked && 'bg-blue-600'}`}></span>
        </div>
      </div>
      {label}
    </label>
  );
};

export default Checkbox;
