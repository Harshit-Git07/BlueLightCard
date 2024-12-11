import { FC, KeyboardEvent } from 'react';
import { CountryIso2, FlagImage } from 'react-international-phone';

const fontStyles = 'font-typography-body text-typography-body font-typography-body-weight';
const countryTextStyles = 'text-colour-onSurface dark:text-colour-onSurface-dark';
const dialCodeTextStyles = 'text-colour-primary dark:text-colour-primary-dark';
const bgStyles = 'bg-colour-surface dark:bg-colour-surface-dark';
const textHoverStyles =
  'group-hover:text-colour-primary-hover group-hover:dark:text-colour-primary-hover-dark';
const bgHoverStyles =
  'hover:bg-colour-surface-container hover:dark:bg-colour-surface-container-dark';

export const RowStyles = {
  fontStyles,
  countryTextStyles,
  dialCodeTextStyles,
  bgStyles,
  textHoverStyles,
  bgHoverStyles,
};

export type Props = {
  iso2: CountryIso2;
  name: string;
  dialCode: string;
  onClick?: () => void;
  totalItem?: number;
};

const RowItem: FC<Props> = ({ iso2, name, dialCode, onClick, totalItem }) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick();
    }
  };
  const itemLength = [1, 2].includes(totalItem ?? 0);
  return (
    <button
      title={name}
      onClick={onClick ? () => onClick() : undefined}
      onKeyDown={handleKeyDown}
      aria-label={`${iso2} ${dialCode}`}
      className={`flex w-full ${bgStyles} ${bgHoverStyles} `}
      data-country={name}
      tabIndex={0}
    >
      <span
        className={`py-2 pl-5 ${itemLength ? 'pr-5' : 'pr-3'}  flex w-full gap-2 items-center cursor-pointer  ${fontStyles} group`}
      >
        <FlagImage data-testid="flag-image" iso2={iso2} className="h-full w-8 rounded-sm" />
        <p className={`${countryTextStyles} ${textHoverStyles}`}>{name}</p>
        <p className={`ml-auto ${dialCodeTextStyles} ${textHoverStyles}`}>+{dialCode}</p>
      </span>
    </button>
  );
};

export default RowItem;
