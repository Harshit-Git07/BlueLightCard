import {
  ChangeEventHandler,
  FC,
  KeyboardEvent,
  MouseEventHandler,
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

const Dropdown: FC<DropdownProps> = ({
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

  const onInputClicked: MouseEventHandler = (event): void => {
    // We do not want to show the dropdown options whenever it is in search mode
    if (searchable) return;

    setIsListboxOpen(!isListboxOpen);
  };

  const onComboboxKeyDown = (event: KeyboardEvent) => {
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

    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().startsWith(event.target.value.toLowerCase()),
    );
    setFilteredOptions(filteredOptions);

    setIsListboxOpen(true);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsListboxOpen(false);
    }
  };

  const onOptionKeyDown = (event: KeyboardEvent, newSelectedOption: DropdownOption) => {
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

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    if (!isListboxOpen || !onOpen || !listboxRef.current) return;

    onOpen(listboxRef.current);
  }, [onOpen, isListboxOpen]);

  const inputClassName = useMemo(() => {
    const opacityClasses =
      selectedOptionOrPlaceholder?.label === placeholder && !searchable
        ? ' opacity-0 group-focus-within:opacity-100 group-focus-within:text-opacity-0 '
        : '';

    const disabledClasses = disabled
      ? ' bg-colour-surface-container text-colour-onSurface-disabled dark:text-colour-onSurface-disabled-dark'
      : 'bg-colour-surface-light dark:bg-colour-surface-dark text-colour-onSurface-subtle dark:text-colour-onSurface-subtle-dark';

    const outlineClasses = searchable ? '' : 'outline-none';

    return `${opacityClasses} ${disabledClasses} ${outlineClasses} w-full h-12 px-4 pt-3 rounded-[4px] text-left group-focus-within:border-colour-primary dark:group-focus-within:border-colour-dds-denim-400 border-colour-onSurface-outline dark:border-colour-onSurface-outline-dark bg-transparent dark:placeholder-colour-onSurface-dark font-typography-body text-typography-body font-typography-body-weight leading-typography-body tracking-typography-body`;
  }, [selectedOptionOrPlaceholder, placeholder, searchable, disabled]);

  const placeholderClassName = useMemo(() => {
    const positionClasses =
      selectedOptionOrPlaceholder?.label !== placeholder || searchTerm !== ''
        ? 'top-3 -translate-y-1/2 font-typography-label font-typography-label-weight text-typography-label leading-typography-label '
        : '';

    const disabledClasses = disabled
      ? 'text-colour-onSurface-disabled dark:text-colour-onSurface-disabled-dark'
      : 'text-colour-onSurface-subtle dark:text-colour-onSurface-subtle-dark';

    return `${positionClasses}${disabledClasses} absolute left-4 transition-all duration-200 pointer-events-none font-typography-body font-typography-body-weight text-typography-body leading-typography-body group-focus-within:top-3 group-focus-within:-translate-y-1/2 group-focus-within:font-typography-label group-focus-within:font-typography-label-weight group-focus-within:text-typography-label group-focus-within:leading-typography-label`;
  }, [selectedOptionOrPlaceholder?.label, placeholder, searchTerm, disabled]);

  const messageClassName = useMemo(() => {
    const errorStyles = error
      ? 'text-colour-error'
      : 'text-colour-onSurface-subtle dark:text-colour-onSurface-subtle-dark';

    return `${errorStyles} group-focus-within:text-colour-primary dark:group-focus-within:text-colour-dds-denim-400 my-[8px] flex font-typography-body text-typography-body-small font-typography-body-weight leading-typography-body-small tracking-typography-body`;
  }, [error]);

  return (
    <div className="group relative inline-block w-full" ref={dropdownRef}>
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
        <div className="my-[8px] flex text-colour-onSurface-subtle dark:text-colour-onSurface-subtle-dark font-typography-body text-typography-body font-typography-body-weight leading-typography-body tracking-typography-body">
          {helpText}
        </div>
      )}

      <div
        className={`relative w-full rounded-[4px] ${disabled ? 'bg-colour-surface-container dark:bg-colour-surface-container-dark' : 'bg-colour-surface-light dark:bg-colour-surface-dark'} ${error ? 'border-colour-error' : 'border-colour-onSurface-outline-subtle-light dark:border-colour-onSurface-outline-subtle-dark '} border cursor-pointer flex justify-between items-center`}
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
          className={`${disabled ? 'text-colour-onSurface-disabled dark:text-colour-onSurface-disabled-dark cursor-default' : 'text-colour-onSurface-subtle dark:text-colour-onSurface-subtle-dark'} font-typography-body text-typography-body font-typography-body-weight leading-typography-body tracking-typography-body px-4 py-3`}
          size="sm"
          icon={isListboxOpen ? faChevronUp : faChevronDown}
          onClick={() => {
            if (disabled) return;

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
