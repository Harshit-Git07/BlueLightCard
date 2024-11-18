import { ChangeEventHandler, FC } from 'react';
import { CountryIso2, FlagImage } from 'react-international-phone';
import { RowStyles } from '../RowItem';

export type Props = {
  iso2: CountryIso2;
  placeholderName: string;
  dialCode: string;
  searchText: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

const { fontStyles, countryTextStyles, dialCodeTextStyles, bgStyles } = RowStyles;
const placeholderStyles =
  'placeholder:text-colour-onSurface-subtle dark:placeholder:text-colour-onSurface-subtle-dark';

const SearchRowItem: FC<Props> = ({ iso2, placeholderName, dialCode, searchText, onChange }) => {
  return (
    <span
      className={`py-2 px-5 flex gap-2 items-center bg-colour-surface-container-light dark:bg-colour-surface-container-dark ${fontStyles} group`}
    >
      <FlagImage iso2={iso2} alt={`Flag of ${placeholderName}`} className="h-full w-8 rounded-sm" />
      <input
        autoFocus
        type="search"
        value={searchText}
        spellCheck={false}
        onChange={onChange}
        placeholder={placeholderName}
        className={`w-full bg-inherit focus:outline-none cursor-text [&::-webkit-search-cancel-button]:hidden ${countryTextStyles} ${placeholderStyles}`}
        aria-label="country-search"
      />
      <p className={`ml-auto ${dialCodeTextStyles}`}>+{dialCode}</p>
    </span>
  );
};

export default SearchRowItem;
