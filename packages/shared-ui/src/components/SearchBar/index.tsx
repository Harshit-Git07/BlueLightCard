import {
  FC,
  useRef,
  useState,
  ChangeEventHandler,
  KeyboardEventHandler,
  useEffect,
  useCallback,
} from 'react';
import { SearchProps } from './types';
import { faSearch, faCircleXmark, faArrowLeft } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SearchBar: FC<SearchProps> = ({
  onSearch,
  labelText,
  onClear,
  onBackButtonClick,
  onFocus,
  onBlur,
  placeholderText,
  value,
  showBackArrow,
  experimentalSearchVariant,
  errorMessage = '',
  clearOnSubmit = false,
  className = '',
}) => {
  const initialValue = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const _showBackArrow = isFocused || showBackArrow;

  useEffect(() => {
    if (value) {
      setSearchTerm(value);
    }
  }, [value]);

  useEffect(() => {
    if (initialValue) {
      isFocused ? initialValue.current?.focus() : initialValue.current?.blur();
    }
  }, [isFocused]);

  const onSubmit: KeyboardEventHandler = (event) => {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    onInputBlur();
    onSearch(searchTerm);

    if (clearOnSubmit) {
      setSearchTerm('');
    }
  };

  const onInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    if (onClear) {
      onClear();
    }

    setSearchTerm('');

    if (initialValue.current) {
      initialValue.current.focus();
    }
  };

  const _onBackButtonClick = useCallback(() => {
    if (onBackButtonClick) {
      onBackButtonClick();
    }

    setIsFocused(false);
    setSearchTerm('');
  }, []);

  const onInputFocus = () => {
    if (onFocus) {
      onFocus();
    }

    setIsFocused(true);
  };

  const onInputBlur = () => {
    if (onBlur) {
      onBlur();
    }

    setIsFocused(false);
  };

  const leftArrow = (
    <button
      aria-label="Back button"
      className="absolute left-2 px-2 top-1/2 transform -translate-y-1/2"
      type="button"
      onClick={_onBackButtonClick}
    >
      <FontAwesomeIcon
        icon={faArrowLeft}
        size="xl"
        className="text-searchBar-icon-colour-light dark:text-searchBar-icon-colour-dark"
        aria-hidden="true"
      />
    </button>
  );

  const searchIcon = (
    <FontAwesomeIcon
      icon={faSearch}
      className="absolute w-[24px] h-[24px] left-2 px-2 top-1/2 transform -translate-y-1/2 text-searchBar-icon-colour-light dark:text-searchBar-icon-colour-dark"
      aria-hidden="true"
    />
  );

  const clearIcon = (
    <button aria-label="Clear button" type="button">
      <FontAwesomeIcon
        icon={faCircleXmark}
        size="xl"
        onClick={clearSearch}
        className="absolute right-2 px-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-searchBar-icon-colour-light dark:text-searchBar-icon-colour-dark"
        aria-hidden="true"
      />
    </button>
  );

  const experimentalFormVariant = (variant: string | undefined): string => {
    type Variants = 'background-variant-dark' | 'background-variant-light';

    const experimentStyles = {
      'background-variant-dark':
        'bg-colour-primary-light shadow-[0_4px_4px_4px_rgba(42,42,42,0.16)]',
      'background-variant-light': 'bg-[#F6F9FF] shadow-[0_4px_4px_4px_rgba(42,42,42,0.16)]',
      default: '',
    };

    return experimentStyles[variant as Variants] ?? experimentStyles['default'];
  };

  const experimentalBorderVariant = (): string => {
    let variant = 'border border-searchBar-outline-colour-light';

    if (experimentalSearchVariant === 'border-variant') {
      variant = 'border-2 border-colour-primary-light shadow-[0px_4px_8px_2px_rgba(0,0,0,0.16)]';
    } else if (experimentalSearchVariant === 'background-variant-light') {
      variant = 'border-2 border-colour-primary-light';
    }

    return variant;
  };

  const inputClasses = [
    'search-bar',
    'text-ellipsis',
    'pl-14',
    'pr-12',
    'py-3',
    'rounded-full',
    'w-full',
    'overflow-x-hidden',
    'bg-searchBar-bg-colour-light',
    'dark:bg-searchBar-bg-colour-dark',
    'focus:outline-none',
    'text-searchBar-label-colour-light',
    'dark:text-searchBar-label-colour-dark',
    'dark:border-searchBar-outline-colour-dark',
    'font-searchBar-label-font',
    'text-searchBar-label-font',
    'font-searchBar-label-font-weight',
    'tracking-searchBar-label-font',
    'leading-searchBar-label-font',
    experimentalBorderVariant(),
  ];

  const formClasses = ['p-4', 'z-10', 'w-full', className];

  if (
    experimentalFormVariant(experimentalSearchVariant) !== '' &&
    experimentalSearchVariant !== 'trending-searches'
  ) {
    formClasses.push(experimentalFormVariant(experimentalSearchVariant));
  }

  return (
    <form className={formClasses.join(' ')}>
      <div className="relative">
        {_showBackArrow ? leftArrow : searchIcon}
        <input
          aria-label={labelText}
          id="searchInput"
          ref={initialValue}
          onFocus={onInputFocus}
          onBlur={onInputBlur}
          onChange={onInputChange}
          value={searchTerm}
          placeholder={isFocused ? '' : placeholderText}
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          onKeyDown={onSubmit}
          className={inputClasses.join(' ')}
        />
        {searchTerm && clearIcon}
      </div>

      {errorMessage && (
        <div
          className={`error-message pt-2 px-2.5 ${experimentalSearchVariant === 'background-variant-dark' ? 'text-white' : 'text-colour-system-red-500'}`}
        >
          {errorMessage}
        </div>
      )}
    </form>
  );
};

export default SearchBar;
