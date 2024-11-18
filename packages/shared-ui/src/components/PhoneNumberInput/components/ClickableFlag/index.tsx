import { FlagImage, ParsedCountry } from 'react-international-phone';
import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/pro-solid-svg-icons';

export type Props = {
  country: ParsedCountry;
  isOpen: boolean;
  toggleDropdown: () => void;
  disabled?: boolean;
  className: string;
  isSelectable?: boolean;
  controlsId?: string;
};

const ClickableFlag: FC<Props> = ({
  country,
  isOpen,
  toggleDropdown,
  disabled,
  className,
  isSelectable,
  controlsId,
}) => {
  return (
    <button
      title={country.name}
      aria-label="Country selector"
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-controls={controlsId}
      type="button"
      disabled={disabled}
      data-country={country.iso2}
      className={`flex flex-row items-center ${!isSelectable ? 'cursor-default' : 'cursor-pointer'} ${className}`}
      onClick={isSelectable ? toggleDropdown : undefined}
    >
      <FlagImage iso2={country.iso2} className={`h-full w-8 rounded-sm`} />
      {isSelectable && (
        <FontAwesomeIcon
          className="h-3 w-3 text-colour-onSurface-light dark:text-colour-onSurface-dark p-1"
          size="2xs"
          icon={isOpen ? faCaretUp : faCaretDown}
        />
      )}
    </button>
  );
};

export default ClickableFlag;
