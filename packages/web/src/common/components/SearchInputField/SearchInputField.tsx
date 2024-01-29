import React, { useEffect } from 'react';
import { SearchInputFieldProps } from './types';

const SearchInputField: React.FC<SearchInputFieldProps> = ({
  iconLocation = 'left',
  icon = undefined,
  prefillData = '',
  onSubmit = undefined,
}) => {
  const [textValue, setTextValue] = React.useState(prefillData);

  useEffect(() => {
    if (textValue === '') {
      setTextValue(prefillData);
    }
  }, [prefillData]);

  return (
    <div className="relative flex h-full">
      <input
        type="email"
        placeholder="Search"
        value={textValue}
        onChange={(e) => setTextValue(e.target.value)}
        onKeyDown={(e) => {
          e.key === 'Enter' && onSubmit && onSubmit(textValue);
        }}
        className={`${
          iconLocation === 'left' ? 'pr-3 pl-12' : 'pl-4 pr-12'
        } w-full bg-transparent rounded-full border border-stroke dark:border-dark-3 py-[5px]  text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2`}
      />
      <span
        className={`absolute top-1/2 -translate-y-1/2 cursor-pointer ${
          iconLocation === 'left' ? 'left-4' : 'right-4'
        }`}
        onClick={() => onSubmit && onSubmit(textValue)}
      >
        {icon}
      </span>
    </div>
  );
};

export default SearchInputField;
