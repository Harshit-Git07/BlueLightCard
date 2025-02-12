'use client';

import { FC, MouseEventHandler, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-solid-svg-icons';
import { toClassNames } from '../../../utils/cssUtil';
import Link from 'next/link';
import LinkList from './LinkList';

export type NavLink = {
  id?: string;
  url?: string;
  label: string;
  onClick?: () => void;
};

export type Props = {
  links?: NavLink[];
} & NavLink;

const tokens = {
  font: 'font-NavBar-link-font font-NavBar-link-font-weight',
  text: 'text-NavBar-link-font',
  letterSpacing: 'tracking-NavBar-link-font',
  lineHeight: 'leading-NavBar-link-font',
  link: 'w-full h-10 px-5 flex min-w-fit items-center gap-1 border-b border-transparent transition mobile-xl:h-full mobile-xl:justify-center mobile-xl:px-0',
  interaction: {
    active: 'text-NavBar-item-text-active-colour dark:text-NavBar-item-text-active-colour-dark',
    hover:
      'hover:text-NavBar-link-hover-colour hover:border-b-NavBar-link-hover-colour dark:hover:text-NavBar-link-hover-colour-dark dark:hover:border-b-NavBar-link-hover-colour-dark',
  },
} as const;

const NavLink: FC<Props> = ({ url, label, links, onClick }) => {
  const [toggleVisibility, setToggleVisibility] = useState(false);
  const linkButtonTrigger = useRef<HTMLButtonElement>(null);

  const onButtonClickHandler: MouseEventHandler<HTMLButtonElement> = () => {
    if (onClick) {
      onClick();
    }

    setToggleVisibility(!toggleVisibility);
  };

  useEffect(() => {
    const onDocumentClickHandler: Parameters<typeof document.addEventListener>[1] = (event) => {
      const buttonElement = linkButtonTrigger.current;

      if (!buttonElement?.contains(event.target as Node)) {
        setToggleVisibility(false);
      }
    };

    document.addEventListener('click', onDocumentClickHandler);

    return () => {
      document.removeEventListener('click', onDocumentClickHandler);
    };
  }, []);

  return (
    <div className="relative">
      {links?.length ? (
        <>
          <button
            ref={linkButtonTrigger}
            aria-label="Toggle dropdown"
            aria-haspopup="menu"
            className={toClassNames([
              tokens.link,
              tokens.font,
              tokens.text,
              tokens.lineHeight,
              tokens.letterSpacing,
              toggleVisibility ? tokens.interaction.active : tokens.interaction.hover,
            ])}
            onClick={onButtonClickHandler}
          >
            {label}
            <FontAwesomeIcon icon={toggleVisibility ? faChevronUp : faChevronDown} />
          </button>
          <LinkList
            links={links}
            className={toClassNames([
              'w-full mobile-xl:w-max mobile-xl:absolute',
              toggleVisibility ? 'flex' : 'hidden',
            ])}
          />
        </>
      ) : (
        <Link
          href={url ?? ''}
          className={toClassNames([
            tokens.link,
            tokens.font,
            tokens.text,
            tokens.lineHeight,
            tokens.letterSpacing,
            tokens.interaction.hover,
          ])}
          onClick={onClick}
        >
          <p>{label}</p>
        </Link>
      )}
    </div>
  );
};

export default NavLink;
