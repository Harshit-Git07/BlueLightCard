import {
  ChangeEventHandler,
  FC,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEventHandler,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { DropdownOption, DropdownProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-solid-svg-icons';
import DropdownLabel from './components/DropdownLabel';
import DropdownList from './components/DropdownList';
import { getSelectedOption } from './utils/DropdownPlaceholderBuilder';
import { colours, fonts } from '../../tailwind/theme';

const Dropdown: FC<DropdownProps> = ({
  className = '',
  options,
  placeholder,
  disabled,
  searchable,
  customClass,
  onSelect,
  onOpen,
  label,
  showTooltipIcon,
  tooltipIcon,
  tooltipText,
  helpText,
  message,
  error = false,
  selectedValue,
  maxItemsShown,
}) => {
  const [selectedOption, setSelectedOption] = useState(
    getSelectedOption(options, placeholder, selectedValue),
  );
  const [isListboxOpen, setIsListboxOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);

  const dropdownId = useId();
  const labelId = useId();
  const dropdownPlaceholderId = useId();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const comboboxRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

  const selectedOptionOrPlaceholder = useMemo(() => {
    if (selectedOption) return selectedOption;

    return {
      id: placeholder,
      label: placeholder,
    };
  }, [placeholder, selectedOption]);

  const onInputClicked: MouseEventHandler = (): void => {
    if (searchable) {
      setIsListboxOpen(true);
      return;
    }

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
      setFilteredOptions(options);
      return;
    }

    const searchTerm = event.target.value.toLowerCase().trimStart();
    const filteredOptions = options.filter((option) => {
      const labelAdjustedForSearching = option.label.toLowerCase().trimStart();
      return labelAdjustedForSearching.includes(searchTerm);
    });
    setFilteredOptions(filteredOptions);

    setIsListboxOpen(true);
  };

  const onOptionKeyDown = (event: ReactKeyboardEvent, newSelectedOption: DropdownOption) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.key === 'Enter' || event.key === ' ') {
      handleSelectOption(newSelectedOption);
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

  const handleSelectOption = (option: DropdownOption) => {
    if (disabled) return;

    setSearchTerm(option.label);
    setSelectedOption(option);
    setIsListboxOpen(false);
    onSelect(option);
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

  const inputClassName = useMemo(() => {
    const opacityStyles =
      selectedOptionOrPlaceholder?.label === placeholder && !searchable
        ? 'opacity-0 group-focus-within:opacity-100 group-focus-within:text-opacity-0'
        : '';

    const colourStyles = disabled
      ? `${colours.backgroundSurfaceContainer} ${colours.textOnSurfaceDisabled}`
      : `${colours.backgroundSurface} ${colours.textOnSurface}`;

    const outlineClasses = searchable ? '' : 'outline-none';

    return `${opacityStyles} ${colourStyles} ${outlineClasses} ${fonts.body} w-full h-12 px-4 pt-3 rounded-[4px] text-left group-focus-within:border-colour-primary dark:group-focus-within:border-colour-dds-denim-400 ${colours.borderOnSurfaceOutline} bg-transparent dark:placeholder-colour-onSurface-dark`;
  }, [selectedOptionOrPlaceholder, placeholder, searchable, disabled]);

  const placeholderClassName = useMemo(() => {
    const positionStyles =
      selectedOptionOrPlaceholder?.label !== placeholder || searchTerm !== ''
        ? `top-3 -translate-y-1/2 ${fonts.label}`
        : '';

    const colourStyles = disabled ? colours.textOnSurface : colours.textOnSurfaceSubtle;

    return `${positionStyles} ${colourStyles} absolute left-4 transition-all duration-200 pointer-events-none ${fonts.body} group-focus-within:top-3 group-focus-within:-translate-y-1/2 group-focus-within:font-typography-label group-focus-within:font-typography-label-weight group-focus-within:text-typography-label group-focus-within:leading-typography-label`;
  }, [selectedOptionOrPlaceholder?.label, placeholder, searchTerm, disabled]);

  const messageClassName = useMemo(() => {
    const errorStyles = error ? colours.textError : colours.textOnSurfaceSubtle;

    return `${errorStyles} ${fonts.body} flex group-focus-within:text-colour-primary dark:group-focus-within:text-colour-dds-denim-400 my-[8px]`;
  }, [error]);

  return (
    <div className={`${className} group relative inline-block w-full`} ref={dropdownRef}>
      {label && (
        <DropdownLabel
          labelId={labelId}
          dropdownId={dropdownId}
          label={label}
          tooltipText={tooltipText}
          tooltipOpen={tooltipOpen}
          showTooltipIcon={showTooltipIcon}
          tooltipIcon={tooltipIcon}
          onTooltipClicked={() => setTooltipOpen(!tooltipOpen)}
        />
      )}

      {helpText && (
        <div className={`${fonts.body} ${colours.textOnSurfaceSubtle} flex my-[8px]`}>
          {helpText}
        </div>
      )}

      <div
        className={`relative w-full rounded-[4px] ${disabled ? colours.backgroundSurfaceContainer : colours.backgroundSurface} ${error ? colours.borderError : colours.borderOnSurfaceOutlineSubtle} border cursor-pointer flex justify-between items-center`}
      >
        <input
          id={dropdownId}
          ref={comboboxRef}
          className={inputClassName}
          role="combobox"
          disabled={disabled}
          autoComplete="off"
          spellCheck={false}
          tabIndex={0}
          aria-controls={isListboxOpen ? `dropdown-listbox-${dropdownId}` : ''}
          aria-expanded={isListboxOpen}
          aria-describedby={dropdownPlaceholderId}
          aria-label={placeholder}
          aria-labelledby={label ? labelId : undefined}
          type={searchable ? 'text' : 'button'}
          onChange={onComboboxChange}
          onClick={onInputClicked}
          onKeyDown={onComboboxKeyDown}
          value={searchable ? searchTerm : selectedOptionOrPlaceholder?.label}
          data-testid="combobox"
        />

        <span id={dropdownPlaceholderId} className={placeholderClassName}>
          {placeholder}
        </span>

        <FontAwesomeIcon
          className={`${disabled ? colours.textOnSurfaceDisabled : colours.textOnSurfaceSubtle}} ${fonts.body} px-4 py-3`}
          size="sm"
          icon={isListboxOpen ? faChevronUp : faChevronDown}
          data-testid="dropdown-expand-icon"
          onClick={() => {
            if (disabled) return;

            if (!isListboxOpen) {
              comboboxRef.current?.focus();
            }

            setIsListboxOpen(!isListboxOpen);
          }}
        />
      </div>

      {isListboxOpen && (
        <DropdownList
          className={customClass}
          listboxRef={listboxRef}
          dropdownId={dropdownId}
          maxItemsShown={maxItemsShown}
          options={filteredOptions}
          disabled={disabled}
          selectedOption={selectedOptionOrPlaceholder}
          onSelected={handleSelectOption}
          onOptionKeyDown={onOptionKeyDown}
        />
      )}

      {message && <div className={messageClassName}>{message}</div>}
    </div>
  );
};

export default Dropdown;
