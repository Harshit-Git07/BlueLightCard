import { FC, useEffect, useRef, useState } from 'react';
import { InputTypeSelectProps, KeyValue } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-solid-svg-icons';

const InputTypeSelect: FC<InputTypeSelectProps> = ({
  options,
  placeholder,
  onSelect,
  disabled,
  customClass,
}) => {
  const [selected, setSelected] = useState(placeholder);
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  const renderIcons = () => {
    return isOpen ? (
      <FontAwesomeIcon
        icon={faChevronUp}
        size="sm"
        className="text-colour-onSurface-subtle-light dark:text-colour-onSurface-subtle-dark font-typography-body text-typography-body font-typography-body-weight leading-typography-body tracking-typography-body"
      />
    ) : (
      <FontAwesomeIcon
        icon={faChevronDown}
        size="sm"
        className="text-colour-onSurface-subtle-light dark:text-colour-onSurface-subtle-dark font-typography-body text-typography-body font-typography-body-weight leading-typography-body tracking-typography-body"
      />
    );
  };

  const handleSelectOption = (option: KeyValue) => {
    handleSelect(option.label);
    onSelect(option.id);
    setIsOpen(false);
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return (
    <div className="relative inline-block w-full" ref={selectRef}>
      <div
        className="rounded-[4px] bg-colour-surface-light dark:bg-colour-surface-dark border-colour-onSurface-outline-light dark:border-colour-onSurface-outline-dark border px-4 py-3 cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={`font-typography-body text-typography-body font-typography-body-weight leading-typography-body tracking-typography-body ${
            selected === placeholder
              ? 'text-colour-onSurface-subtle-light dark:text-colour-onSurface-subtle-dark'
              : 'text-colour-onSurface-light dark:text-colour-onSurface-dark'
          }`}
        >
          {selected}
        </span>
        {renderIcons()}
      </div>
      {isOpen && (
        <select
          className={`w-full mt-2 overflow-y-auto focus:hidden rounded-[4px] cursor-pointer border-colour-onSurface-outline-light dark:border-colour-onSurface-outline-dark border ${customClass}`}
          size={options.length}
        >
          {options.map((option, index) => (
            <option
              key={index}
              value={option.id}
              className={`flex h-7 items-center cursor-pointer focus:outline-none px-5 focus:text-dropDownItem-text-active-colour focus:border-b-dropDownItem-border-active-colour focus:border-b hover:border-b hover:bg-dropDownItem-bg-hover-colour hover:text-dropDownItem-text-hover-colour hover:border-b-dropDownItem-divider-hover-colour dark:focus:text-dropDownItem-text-active-colour-dark dark:focus:border-b-dropDownItem-border-active-colour-dark dark:hover:bg-dropDownItem-bg-hover-colour-dark dark:hover:text-dropDownItem-text-hover-colour-dark  dark:hover:border-b-dropDownItem-divider-hover-colour-dark font-dropDownItem-label-font font-dropDownItem-label-font-weight text-dropDownItem-label-font tracking-dropDownItem-label-font leading-dropDownItem-label-font text-dropDownItem-text-colour dark:text-dropDownItem-text-colour-dark ${
                selected === option.label
                  ? 'border-b border-b-dropDownItem-bg-colour dark:border-b-dropDownItem-bg-colour-dark'
                  : ''
              }`}
              onClick={() => handleSelectOption(option)}
              disabled={disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default InputTypeSelect;
