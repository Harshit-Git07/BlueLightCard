import { ChangeEventHandler, FC, KeyboardEvent, useEffect, useId, useRef, useState } from 'react';
import { DropdownProps, KeyValue } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-solid-svg-icons';

const Dropdown: FC<DropdownProps> = (props) => {
  const { options, placeholder, disabled, searchable, customClass, onSelect, onOpen } = props;

  const [selected, setSelected] = useState(placeholder);
  const [isListboxOpen, setIsListboxOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const dropdownId = useId();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const comboboxRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

  const createArrayAndMap = (source: KeyValue[]) => {
    const map = new Map(source.map((source) => [source.id, { ...source }]));

    return { array: source, map };
  };

  // Create a new reference to the options array and a Map version.
  // This allows easier access of individual selected options
  // While also ensuring state of both types stays in sync.
  const [optionsState, setOptionsState] = useState(createArrayAndMap(options));
  const { array: optionsArray, map: optionsMap } = optionsState;

  const selectedOption =
    selected === placeholder ? { id: placeholder, label: placeholder } : optionsMap.get(selected);

  const openListbox = () => {
    setIsListboxOpen(true);
  };

  const closeListbox = () => {
    setIsListboxOpen(false);
  };

  const toggleListbox = () => {
    if (!isListboxOpen) return openListbox();

    closeListbox();
  };

  const onComboboxKeyDown = (event: KeyboardEvent) => {
    if (searchable && searchTerm === '') return;

    const openKeys = ['Enter', 'ArrowDown', 'ArrowUp', ' '];

    if (!openKeys.includes(event.key)) return;

    if (!isListboxOpen) {
      openListbox();
      return;
    }

    if (isListboxOpen && event.key === 'ArrowDown' && listboxRef.current) {
      const listbox = listboxRef.current;
      if (!listbox.children) return;

      const firstOption = listbox?.children?.item(0) as HTMLElement;
      firstOption?.focus();

      return;
    }

    closeListbox();
  };

  const onComboboxChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setSearchTerm(event.target.value);

    if (event.target.value === '') {
      closeListbox();
      setOptionsState(createArrayAndMap(options));
      return;
    }

    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().startsWith(event.target.value.toLowerCase()),
    );

    setOptionsState(createArrayAndMap(filteredOptions));
    openListbox();
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      closeListbox();
    }
  };

  const onOptionKeyDown = (newSelectedOption: KeyValue) => (event: KeyboardEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.key === 'Enter' || event.key === ' ') {
      handleSelectOption(newSelectedOption);
    }

    if (event.key === 'Escape') {
      closeListbox();
      (comboboxRef.current as HTMLElement)?.focus();
    }

    if (event.key === 'ArrowDown' && event.currentTarget.nextElementSibling) {
      (event.currentTarget.nextElementSibling as HTMLElement).focus();
    }

    if (event.key === 'ArrowUp' && event.currentTarget.previousElementSibling) {
      (event.currentTarget.previousElementSibling as HTMLElement).focus();
    }
  };

  const handleSelectOption = (option: KeyValue) => {
    if (disabled) return;

    setSearchTerm(option.label);
    setSelected(option.id);
    closeListbox();
    onSelect(option);
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    if (!isListboxOpen || !onOpen || !listboxRef.current) return;

    onOpen(listboxRef.current);
  }, [onOpen, listboxRef.current]);

  return (
    <div className="relative inline-block w-full" ref={dropdownRef}>
      <div className="w-full rounded-[4px] bg-colour-surface-light dark:bg-colour-surface-dark border-colour-onSurface-outline-light dark:border-colour-onSurface-outline-dark border cursor-pointer flex justify-between items-center">
        <input
          ref={comboboxRef}
          className="w-full h-12 px-4 py-3 rounded-[4px] text-left bg-colour-surface-light dark:bg-colour-surface-dark placeholder-colour-onSurface-light dark:placeholder-colour-onSurface-dark text-colour-onSurface-light dark:text-colour-onSurface-dark font-typography-body text-typography-body font-typography-body-weight leading-typography-body tracking-typography-body"
          role="combobox"
          autoComplete="off"
          spellCheck={false}
          tabIndex={0}
          aria-controls={isListboxOpen ? `dropdown-listbox-${dropdownId}` : ''}
          aria-expanded={isListboxOpen}
          placeholder={placeholder}
          type={searchable ? 'text' : 'button'}
          onClick={searchable ? undefined : toggleListbox}
          onChange={onComboboxChange}
          onKeyDown={onComboboxKeyDown}
          value={searchable ? searchTerm : selectedOption?.label}
        />

        <FontAwesomeIcon
          className="text-colour-onSurface-light dark:text-colour-onSurface-dark font-typography-body text-typography-body font-typography-body-weight leading-typography-body tracking-typography-body px-4 py-3"
          size="sm"
          icon={isListboxOpen ? faChevronUp : faChevronDown}
          onClick={toggleListbox}
        />
      </div>

      {isListboxOpen && (
        <div
          ref={listboxRef}
          id={`dropdown-listbox-${dropdownId}`}
          role="listbox"
          tabIndex={0}
          className={`w-full mt-2 overflow-y-auto focus:outline-none rounded-[4px] cursor-pointer border-colour-onSurface-outline-light dark:border-colour-onSurface-outline-dark border bg-colour-surface-light dark:bg-colour-surface-dark text-colour-onSurface-light dark:text-colour-onSurface-dark font-typography-body text-typography-body font-typography-body-weight leading-typography-body tracking-typography-body ${customClass}`}
        >
          {optionsArray.length > 0 &&
            optionsArray.map((option, index) => (
              <div
                role="option"
                aria-disabled={disabled}
                aria-selected={selected === option.id}
                tabIndex={index + 1}
                key={option.id}
                className={`flex h-7 items-center cursor-pointer p-5 focus:text-dropDownItem-text-active-colour focus:border-b-dropDownItem-border-active-colour focus:border-b hover:border-b hover:bg-dropDownItem-bg-hover-colour hover:text-dropDownItem-text-hover-colour hover:border-b-dropDownItem-divider-hover-colour dark:focus:text-dropDownItem-text-active-colour-dark dark:focus:border-b-dropDownItem-border-active-colour-dark dark:hover:bg-dropDownItem-bg-hover-colour-dark dark:hover:text-dropDownItem-text-hover-colour-dark  dark:hover:border-b-dropDownItem-divider-hover-colour-dark font-dropDownItem-label-font font-dropDownItem-label-font-weight text-dropDownItem-label-font tracking-dropDownItem-label-font leading-dropDownItem-label-font text-dropDownItem-text-colour dark:text-dropDownItem-text-colour-dark ${
                  selected === option.id
                    ? 'border-b border-b-dropDownItem-bg-colour dark:border-b-dropDownItem-bg-colour-dark'
                    : ''
                }`}
                onClick={() => handleSelectOption(option)}
                onKeyDown={onOptionKeyDown(option)}
              >
                {option.label}
              </div>
            ))}

          {optionsArray.length < 1 && (
            <div className="w-full flex h-7 p-5 items-center font-dropDownItem-label-font font-dropDownItem-label-font-weight text-dropDownItem-label-font tracking-dropDownItem-label-font leading-dropDownItem-label-font text-dropDownItem-text-colour text-center text-dropDownItem-text-colour dark:text-dropDownItem-text-colour-dark">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
