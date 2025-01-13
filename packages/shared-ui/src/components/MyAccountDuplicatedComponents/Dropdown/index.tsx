import {
  ChangeEventHandler,
  FC,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEventHandler,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { DropdownOption, DropdownProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-solid-svg-icons';
import DropdownList from './components/DropdownList';
import FloatingPlaceholder from '../FloatingPlaceholder';
import FieldLabel from '../../FieldLabel';
import { colours, fonts, getInputBorderClasses } from '../../../tailwind/theme';
import { floatingPlaceholderInputClasses } from '../FloatingPlaceholder/utils';
import ValidationMessage from '../../ValidationMessage';

const Dropdown: FC<DropdownProps> = ({
  id,
  onChange: onSelect,
  value: selectedValue,
  isValid = undefined,
  label,
  tooltip,
  tooltipPosition,
  description,
  placeholder = '',
  validationMessage,
  isDisabled = false,
  onOpen,
  options,
  searchable,
  dropdownItemsClassName,
  maxItemsShown = 4,
}) => {
  const inputValue = typeof selectedValue === 'string' ? selectedValue : selectedValue?.label ?? '';
  const [searchTerm, setSearchTerm] = useState(inputValue);
  const [isListboxOpen, setIsListboxOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);

  const randomId = useId();
  const componentId = id ?? randomId;
  const dropdownId = `dropdown-${componentId}`;
  const labelId = useId();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const comboboxRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!searchable) return;
    setSearchTerm(inputValue);
  }, [inputValue, searchable]);

  const onDropdownClicked: MouseEventHandler = (): void => {
    setIsListboxOpen(!isListboxOpen);
  };

  const onComboboxKeyDown = (event: ReactKeyboardEvent) => {
    const openKeys = ['Enter', 'ArrowDown', 'ArrowUp'];
    if (!openKeys.includes(event.key)) return;

    event.preventDefault();

    if (!isListboxOpen) {
      setIsListboxOpen(true);
      return;
    }

    const listbox = listboxRef.current;
    if (event.key === 'ArrowDown' && listbox) {
      if (!listbox.children) return;

      const firstOption = listbox?.children?.item(0) as HTMLElement;
      firstOption?.focus();

      return;
    }

    setIsListboxOpen(false);
  };

  const onComboboxChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setSearchTerm(event.target.value);

    if (event.target.value === '') {
      setIsListboxOpen(false);
      setFilteredOptions(options);
      return;
    }

    const searchTerm = event.target.value.toLowerCase().trimStart();
    const filteredOptions = options.filter((option: DropdownOption) => {
      const labelAdjustedForSearching = option.label.toLowerCase().trimStart();
      return labelAdjustedForSearching.includes(searchTerm);
    });
    setFilteredOptions(filteredOptions);

    setIsListboxOpen(true);
  };

  const onKeyDownOption = (event: ReactKeyboardEvent, newSelectedOption: DropdownOption) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.key === 'Enter' || event.key === ' ') {
      onSelectOption(newSelectedOption);
    }

    if (event.key === 'Escape') {
      setIsListboxOpen(false);
      (comboboxRef.current as HTMLElement)?.focus();
    }

    if (event.key === 'ArrowDown' && event.currentTarget.nextElementSibling) {
      (event.currentTarget.nextElementSibling as HTMLElement).focus();
    }

    if (event.key === 'ArrowUp' && event.currentTarget.previousElementSibling) {
      (event.currentTarget.previousElementSibling as HTMLElement).focus();
    }
  };

  const onSelectOption = (option: DropdownOption) => {
    if (isDisabled) return;

    setSearchTerm(option.label);
    setIsListboxOpen(false);
    onSelect && onSelect(option);
  };

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsListboxOpen(false);
      }
    },
    [dropdownRef.current],
  );

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsListboxOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, []);

  useEffect(() => {
    if (!isListboxOpen || !onOpen || !listboxRef.current) return;

    onOpen(listboxRef.current);
  }, [onOpen, isListboxOpen]);

  const borderClasses = getInputBorderClasses(isDisabled, isListboxOpen, isValid);

  const classes = {
    wrapper: `group relative inline-block w-full`,
    inputWrapper: `relative`,
    input: `z-20 w-full h-[50px] pl-[16px] pr-[32px] text-left truncate ${floatingPlaceholderInputClasses(
      !!placeholder,
    )} ${fonts.body} 
    ${searchable && 'pt-[24px]'}
    ${
      isDisabled
        ? `${colours.textOnSurfaceDisabled} cursor-not-allowed`
        : `${colours.textOnSurface} cursor-pointer`
    } ${isDisabled ? colours.backgroundSurfaceContainer : 'bg-transparent'} ${borderClasses}`,
    chevronIconButton: `absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none`,
    chevronIcon: `z10 w-[14px] h-[14px] ${
      isDisabled ? colours.textOnSurfaceDisabled : colours.textOnSurface
    }`,
  };

  const selectedOption = options.find((opt) => opt === selectedValue || opt.id === selectedValue);

  return (
    <div className={classes.wrapper} ref={dropdownRef}>
      {label ? (
        <FieldLabel
          label={label}
          description={description}
          htmlFor={componentId}
          tooltip={tooltip}
          tooltipPosition={tooltipPosition}
        />
      ) : null}

      <div className={classes.inputWrapper}>
        <input
          id={componentId}
          ref={comboboxRef}
          className={classes.input}
          role="combobox"
          disabled={isDisabled}
          autoComplete="off"
          spellCheck={false}
          tabIndex={0}
          aria-controls={`dropdown-listbox-${componentId}`}
          aria-expanded={isListboxOpen}
          aria-describedby={label ? `description-${componentId}` : undefined}
          aria-label={placeholder ?? dropdownId}
          aria-labelledby={label ? labelId : undefined}
          type={searchable ? 'text' : 'button'}
          onChange={onComboboxChange}
          onClick={onDropdownClicked}
          onKeyDown={onComboboxKeyDown}
          value={searchable ? searchTerm : inputValue}
          data-testid="combobox"
        />
        {placeholder ? (
          <FloatingPlaceholder
            htmlFor={componentId}
            hasValue={searchable ? !!searchTerm : !!selectedValue}
            isDisabled={isDisabled}
            text={placeholder}
          />
        ) : null}

        <button
          type="button"
          className={classes.chevronIconButton}
          title={isListboxOpen ? 'Close dropdown' : 'Open dropdown'}
          aria-label={isListboxOpen ? 'Close dropdown' : 'Open dropdown'}
          disabled={isDisabled}
        >
          <FontAwesomeIcon
            className={classes.chevronIcon}
            icon={isListboxOpen ? faChevronUp : faChevronDown}
          />
        </button>
      </div>

      {isListboxOpen ? (
        <DropdownList
          className={dropdownItemsClassName}
          listboxRef={listboxRef}
          dropdownId={componentId}
          maxItemsShown={maxItemsShown}
          options={filteredOptions}
          disabled={isDisabled}
          selectedOption={selectedOption}
          onSelected={onSelectOption}
          onOptionKeyDown={onKeyDownOption}
        />
      ) : null}

      <ValidationMessage
        message={validationMessage}
        htmlFor={dropdownId}
        isValid={isValid}
        isDisabled={isDisabled}
      />
    </div>
  );
};

export default Dropdown;
