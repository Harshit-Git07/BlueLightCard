import { FC, MouseEventHandler } from 'react';
import NextLink from 'next/link';

export type Props = {
  label: string;
  selected: boolean; // Parent determines selected state
  onClick?: MouseEventHandler<HTMLElement>;
  href?: string;
};

const VerticalMenuItem: FC<Props> = ({ label, selected, onClick, href }) => {
  const selectedBorderStyles = 'border-r border-colour-primary dark:border-colour-primary-dark';
  const selectedTextStyles = 'text-colour-primary dark:text-colour-primary-dark';
  const selectedBackgroundStyles =
    'bg-colour-surface-container dark:bg-colour-surface-container-dark';

  const className = `h-[50px] pl-[18px] flex items-center hover:cursor-pointer hover:text-colour-primary-hover hover:dark:text-colour-primary-hover-dark hover:border-r hover:border-colour-primary-hover hover:dark:border-colour-primary-dark ${
    selected ? `${selectedBorderStyles} ${selectedTextStyles} ${selectedBackgroundStyles}` : ''
  }`;

  return (
    <li className={className}>
      {href ? (
        <NextLink className="h-full w-full flex items-center" href={href}>
          <p>{label}</p>
        </NextLink>
      ) : (
        <button className="h-full w-full flex items-center" onClick={onClick}>
          <p>{label}</p>
        </button>
      )}
    </li>
  );
};

export default VerticalMenuItem;
