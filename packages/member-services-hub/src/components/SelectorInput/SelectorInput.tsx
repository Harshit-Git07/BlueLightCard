'use client';
import { FC, useState } from 'react';
import { SelectorInputProps } from './types';

const SelectorInput: FC<SelectorInputProps> = ({
  label,
  disabled,
  placeholder,
  options,
  width,
  onChange,
}) => {
  const disabledTailwind = disabled !== undefined ? tailwindForDisabled(disabled) : '';
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownText, setDropdownText] = useState(
    placeholder !== undefined ? placeholder : 'no text set for placeholder',
  );
  const widthField = width !== undefined ? width : '250px';

  const handleOptionSelect = (optionName: string) => {
    setDropdownText(optionName);
    setDropdownOpen(false);
    if (onChange) {
      onChange(optionName);
    }
  };

  return (
    <>
      <label
        data-testid="selector-label"
        className="mb-[10px] block text-base font-medium text-dark"
      >
        {label}
      </label>
      <div className={`relative`}>
        <div className="relative inline-block mb-8 text-left">
          <button
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
            }}
            className={`bg-primary flex items-center w-[${widthField}] rounded-[10px] px-5 py-[13px] text-base font-medium text-dark border ${disabledTailwind}`}
            disabled={disabled !== undefined ? disabled : false}
          >
            <div className="flex w-full text-right justify-between">
              {dropdownText}
              <span className="pl-4">
                <svg
                  width={20}
                  height={20}
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-current"
                >
                  <path d="M10 14.25C9.8125 14.25 9.65625 14.1875 9.5 14.0625L2.3125 7C2.03125 6.71875 2.03125 6.28125 2.3125 6C2.59375 5.71875 3.03125 5.71875 3.3125 6L10 12.5312L16.6875 5.9375C16.9688 5.65625 17.4063 5.65625 17.6875 5.9375C17.9687 6.21875 17.9687 6.65625 17.6875 6.9375L10.5 14C10.3437 14.1563 10.1875 14.25 10 14.25Z" />
                </svg>
              </span>
            </div>
          </button>
          <div
            className={`shadow-1 absolute left-0 z-40 w-full rounded-md bg-white pt-[5px] transition-all ${
              dropdownOpen ? 'top-full opacity-100 visible' : 'top-[110%] invisible opacity-0'
            }`}
          >
            <div className="border rounded-[10px]">
              {options?.map((option, key) => (
                <DropdownItem
                  key={key}
                  label={option.optionName}
                  onSelect={() => handleOptionSelect(option.optionName)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const DropdownItem: FC<{ label: string; onSelect: () => void }> = ({ label, onSelect }) => {
  return (
    <a
      onClick={onSelect}
      className="text-body-color hover:bg-[#F5F7FD] hover:text-[#000099] block px-5 py-2 text-base cursor-pointer"
    >
      {label}
    </a>
  );
};

function tailwindForDisabled(disabled: boolean) {
  if (disabled === true) {
    return 'disabled:cursor-default disabled:bg-[#e8eae8] disabled:border-gray-2';
  }
  return '';
}

export default SelectorInput;
