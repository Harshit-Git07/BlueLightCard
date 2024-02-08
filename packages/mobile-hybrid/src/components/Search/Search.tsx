import React, {
  FC,
  FormEventHandler,
  useRef,
  useState,
  ChangeEventHandler,
  useEffect,
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
}) => {
  const initialValue = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (value) {
      setSearchTerm(value);
    }
  }, [value]);

  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (searchTerm && searchTerm.length >= 2) {
      setErrorMessage('');
      onSearch(searchTerm);
    } else {
      setErrorMessage('Enter 2 or more characters to search.');
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

  const _onBackButtonClick = () => {
    onBackButtonClick && onBackButtonClick();
    setIsFocused(false);
    setSearchTerm('');
    setErrorMessage('');
  };

  const onInputFocus = () => {
    onFocus && onFocus();
    setIsFocused(true);
  };

  const leftArrow = (
    <FontAwesomeIcon
      icon={faArrowLeft}
      role="button"
      size="xl"
      onClick={_onBackButtonClick}
      className="absolute left-2 px-2 top-1/2 transform -translate-y-1/2 text-neutral-grey-800 dark:text-neutral-white"
      aria-hidden="true"
    />
  );

  const searchIcon = (
    <FontAwesomeIcon
      icon={faSearch}
      size="xl"
      className="absolute left-2 px-2 top-1/2 transform -translate-y-1/2 text-neutral-grey-600 dark:text-neutral-white"
      aria-hidden="true"
    />
  );
  const clearIcon = (
    <FontAwesomeIcon
      icon={faCircleXmark}
      size="xl"
      role="button"
      onClick={clearSearch}
      className="absolute right-2 px-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-neutral-grey-600 dark:text-neutral-white"
      aria-hidden="true"
    />
  );
  return (
    <form onSubmit={onSubmit} className="px-2 z-10 w-full">
      <div className="relative">
        {isFocused || !!searchTerm ? leftArrow : searchIcon}
        <input
          aria-label={labelText}
          id="searchInput"
          ref={initialValue}
          onFocus={onInputFocus}
          onChange={onInputChange}
          value={searchTerm}
          placeholder={placeholderText}
          type="search"
          className="new-search pl-14 pr-12 py-3 text-lg font-museo rounded-full w-full overflow-x-hidden bg-neutral-white border-neutral-grey-200 border dark:text-white dark:border-neutral-700 dark:bg-neutral-grey-800 focus:outline-none"
        />
        {searchTerm && clearIcon}
      </div>
      {errorMessage && <div className="font-museo text-red-500">{errorMessage}</div>}
    </form>
  );
};

export default Search;
