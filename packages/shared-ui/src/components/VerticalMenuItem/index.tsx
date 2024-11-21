import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NextLink from 'next/link';
import { conditionalStrings } from '../../utils/conditionalStrings';
import VerticalMenuItemProps from './types';

const VerticalMenuItem: FC<VerticalMenuItemProps> = ({
  label,
  selected,
  onClick,
  href,
  isExternalLink,
  icon,
}) => {
  const selectedBorderStyles = 'border-r border-colour-primary dark:border-colour-primary-dark';
  const selectedTextStyles = 'text-colour-primary dark:text-colour-primary-dark';
  const selectedBackgroundStyles =
    'bg-colour-surface-container dark:bg-colour-surface-container-dark';

  const combinedStyles = [
    'h-[50px]',
    'pl-[18px] tablet:pl-[2px]',
    'flex',
    'items-center',
    'text-colour-onSurface',
    'dark:text-colour-onSurface-dark',
    'hover:cursor-pointer',
    'hover:text-colour-primary-hover',
    'hover:dark:text-colour-primary-hover-dark',
    'hover:border-r',
    'hover:border-colour-primary-hover',
    'hover:dark:border-colour-primary-dark',
    conditionalStrings({
      [selectedBorderStyles]: selected,
      [selectedTextStyles]: selected,
      [selectedBackgroundStyles]: selected,
    }),
  ].join(' ');

  const itemIcon = icon ? <FontAwesomeIcon className="ml-2" icon={icon} /> : null;

  return (
    <li className={combinedStyles}>
      {href ? (
        <NextLink
          className="h-full w-full flex items-center hover:opacity-100"
          href={href}
          target={isExternalLink ? '_blank' : undefined}
          aria-label={label}
        >
          {label}
          {itemIcon}
        </NextLink>
      ) : (
        <button className="h-full w-full flex items-center" onClick={onClick} aria-label={label}>
          {label}
          {itemIcon}
        </button>
      )}
    </li>
  );
};

export default VerticalMenuItem;
