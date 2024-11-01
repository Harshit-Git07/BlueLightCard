import { ChangeEventHandler, FC, useEffect, useMemo, useState } from 'react';
import { CountryData, CountryIso2, parseCountry, ParsedCountry } from 'react-international-phone';
import RowItem from './RowItem';
import SearchRowItem from './SearchRowItem';

export type Props = {
  dropdownOpen: boolean;
  listOfCountries: CountryData[];
  selectedCountryCode: CountryIso2;
  itemOnClick: (country: ParsedCountry) => void;
  className?: string;
};

const DropdownList: FC<Props> = ({
  dropdownOpen,
  listOfCountries,
  selectedCountryCode,
  itemOnClick,
  className,
}) => {
  const [userSearch, setUserSearch] = useState('');

  const searchValueOnChange: ChangeEventHandler<HTMLInputElement> = (e) =>
    setUserSearch(e.target.value);

  const parsedCountries = listOfCountries.map(parseCountry);
  const selectedCountry = parsedCountries.find((country) => country.iso2 === selectedCountryCode)!;

  const sanitisedUserSearch = useMemo(() => userSearch.toLocaleLowerCase(), [userSearch]);
  const filteredCountries = useMemo(
    () =>
      userSearch
        ? parsedCountries.filter((c) => c.name.toLocaleLowerCase().startsWith(sanitisedUserSearch))
        : parsedCountries.filter((c) => c.iso2 !== selectedCountryCode),
    [userSearch, selectedCountryCode, parsedCountries],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && filteredCountries.length > 0) {
        itemOnClick(filteredCountries[0]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [filteredCountries, itemOnClick]);

  const { iso2: searchRowIso2, dialCode: searchRowDialCode } =
    userSearch && filteredCountries.length
      ? { iso2: filteredCountries[0].iso2, dialCode: filteredCountries[0].dialCode }
      : { iso2: selectedCountryCode, dialCode: selectedCountry.dialCode };

  return (
    <ul
      className={`${dropdownOpen ? 'block' : 'hidden'} top-[58px] p-[2px] absolute w-full bg-colour-surface-container-light dark:bg-colour-surface-container-dark ${className}`}
    >
      <div className="sticky top-0 bg-inherit">
        <SearchRowItem
          iso2={searchRowIso2}
          placeholderName={selectedCountry.name}
          dialCode={searchRowDialCode}
          searchText={userSearch}
          onChange={searchValueOnChange}
        />
        <div className="w-full bg-colour-onSurface-outline dark:bg-colour-onSurface-outline-dark rounded" />
      </div>
      <div
        className={`max-h-[125px] m-[1px] rounded  ${filteredCountries.length > 2 && 'pr-0  overflow-y-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-colour-onSurface-outline [&::-webkit-scrollbar-track]:bg-surface-container-light dark:bg-colour-surface-container-dark [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:rounded-full'}`}
      >
        {filteredCountries.map((c) => (
          <li key={c.iso2}>
            <RowItem
              totalItem={filteredCountries.length}
              iso2={c.iso2}
              name={c.name}
              dialCode={c.dialCode}
              onClick={() => itemOnClick(c)}
            />
          </li>
        ))}
      </div>
    </ul>
  );
};

export default DropdownList;
