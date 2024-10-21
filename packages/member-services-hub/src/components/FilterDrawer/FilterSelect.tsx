import { FC, SetStateAction, useState } from 'react';
import { FilterDrawerOption, FilterDrawerSelectProps } from './types';

const Select: FC<FilterDrawerSelectProps> = ({ id, placeHolder, values }) => {
  const [selected, setSelected] = useState();
  const handleChange = (e: { target: SetStateAction<undefined> }) => {
    setSelected(e.target);
  };
  return (
    <label className="mt-1 grid gap-4 grid-cols-1 items-center w-full cursor-pointer select-none text-dark">
      <div className="relative">
        <select
          id={id}
          onChange={() => handleChange}
          defaultValue={placeHolder}
          value={selected}
          className="w-full rounded-lg p-2 border border-stroke dark:border-dark-3"
        >
          <option disabled className="text-shade-greyscale-grey-500">
            {placeHolder}
          </option>
          {values &&
            values.map((obj: FilterDrawerOption) => {
              return (
                <option key={obj.value} value={obj.value}>
                  {obj.label}
                </option>
              );
            })}
        </select>
      </div>
    </label>
  );
};

export default Select;
