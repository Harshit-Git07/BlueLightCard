import { FlagImage } from 'react-international-phone';
import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/pro-solid-svg-icons';

export type Props = {
  isOpen: boolean;
  toggleDropdown: () => void;
  disabled?: boolean;
  className: string;
  isSelectable?: boolean;
  controlsId?: string;
  name?: string;
  iso2?: string;
};

const ClickableFlag: FC<Props> = ({
  isOpen,
  toggleDropdown,
  disabled,
  className,
  isSelectable,
  controlsId,
  iso2 = '',
  name = '',
}) => {
  return (
    <button
      title={name}
      aria-label="Country selector"
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-controls={controlsId}
      type="button"
      disabled={disabled}
      data-country={iso2}
      className={`flex flex-row items-center ${!isSelectable ? 'cursor-default' : 'cursor-pointer'} ${className}`}
      onClick={isSelectable ? toggleDropdown : undefined}
    >
      <FlagImage iso2={iso2} className={`h-full w-[32px] rounded-sm`} />
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
