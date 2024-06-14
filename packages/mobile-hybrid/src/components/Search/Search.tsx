import React, {
  FC,
  FormEventHandler,
  useRef,
  useState,
  ChangeEventHandler,
  useEffect,
  useCallback,
} from 'react';
import { SearchProps } from './types';
import { faSearch, faCircleXmark, faArrowLeft } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Search: FC<SearchProps> = ({
  onSearch,
  labelText,
  onClear,
  onBackButtonClick,
  onFocus,
  placeholderText,
  value,
  showBackArrow,
}) => {
  const initialValue = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

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

  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (searchTerm && searchTerm.length >= 3) {
      setErrorMessage('');
      setIsFocused(false);
      onSearch(searchTerm);
    } else {
      setErrorMessage('Enter 3 or more characters to search.');
    }
  };

  const onInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    onClear && onClear();
    setSearchTerm('');
    if (initialValue.current) {
      initialValue.current.focus();
    }
  };

  const _onBackButtonClick = useCallback(() => {
    onBackButtonClick && onBackButtonClick();
    setIsFocused(false);
    setErrorMessage('');
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, []);

  const onInputFocus = () => {
    onFocus && onFocus();
    setIsFocused(true);
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
      size="xl"
      className="absolute left-2 px-2 top-1/2 transform -translate-y-1/2 text-searchBar-icon-colour-light dark:text-searchBar-icon-colour-dark"
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
  return (
    <form onSubmit={onSubmit} className="px-2 z-10 w-full">
      <div className="relative">
        {_showBackArrow ? leftArrow : searchIcon}
        <input
          aria-label={labelText}
          id="searchInput"
          ref={initialValue}
          onFocus={onInputFocus}
          onChange={onInputChange}
          value={searchTerm}
          placeholder={placeholderText}
          type="search"
          enterKeyHint="search"
          className="new-search pl-14 pr-12 py-3 text-lg font-museo rounded-full w-full overflow-x-hidden bg-searchBar-bg-colour-light dark:bg-searchBar-bg-colour-dark border-searchBar-outline-colour-light border text-searchBar-label-colour-light dark:text-searchBar-label-colour-dark dark:border-searchBar-outline-colour-dark focus:outline-none"
        />
        {searchTerm && clearIcon}
      </div>
      {errorMessage && <div className="font-museo text-colour-system-red-500">{errorMessage}</div>}
    </form>
  );
};

export default Search;
