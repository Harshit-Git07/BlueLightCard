import { FC, MouseEventHandler } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/pro-solid-svg-icons';
import NextLink from 'next/link';
import { conditionalStrings } from '@bluelightcard/shared-ui/utils/conditionalStrings';

export type Props = {
  label: string;
  selected: boolean;
  onClick?: MouseEventHandler<HTMLElement>;
  href?: string;
  isExternalLink?: boolean;
  icon?: IconDefinition;
};

const VerticalMenuItem: FC<Props> = ({ label, selected, onClick, href, isExternalLink, icon }) => {
  const selectedBorderStyles = 'border-r border-colour-primary dark:border-colour-primary-dark';
  const selectedTextStyles = 'text-colour-primary dark:text-colour-primary-dark';
  const selectedBackgroundStyles =
    'bg-colour-surface-container dark:bg-colour-surface-container-dark';

  const combinedStyles = [
    'h-[50px]',
    'pl-[18px]',
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
        >
          <p>{label}</p>
          {itemIcon}
        </NextLink>
      ) : (
        <button className="h-full w-full flex items-center" onClick={onClick}>
          <p>{label}</p>
          {itemIcon}
        </button>
      )}
    </li>
  );
};

export default VerticalMenuItem;
