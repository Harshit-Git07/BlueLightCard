import React, { FC, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGrid2,
  faUsersRectangle,
  faChevronUp,
  faAddressCard,
  faBuildings,
  faTicketsSimple,
  faAt,
  faUserTieHairLong,
  faArrowRightFromBracket,
} from '@fortawesome/pro-regular-svg-icons';
import MshLogo from '@assets/BLC-logo.svg';
import { DropdownItemProps, NavItemProps } from './types';
import { cssUtil } from '@/app/common/utils/cssUtil';
import Link from 'next/link';

const GlobalNavigation = () => {
  return (
    <section className="h-screen bg-gray-2">
      <div className="flex h-screen w-full max-w-[340px] flex-col justify-between bg-white shadow">
        <div>
          <div className="px-5 pt-4 pb-9">
            <Link href="/">
              <MshLogo />
            </Link>
          </div>
          <nav>
            <NavItem
              link="/"
              icon={<FontAwesomeIcon icon={faGrid2} />}
              menu="Dashboard"
              submenu={false}
            />
            <NavItem
              link="/members"
              icon={<FontAwesomeIcon icon={faUsersRectangle} />}
              menu="Members"
              submenu={false}
            />
            <NavItem
              link="/card-print"
              icon={<FontAwesomeIcon icon={faAddressCard} />}
              menu="Card Printing"
              submenu={false}
            />
            <NavItem
              link="/"
              icon={<FontAwesomeIcon icon={faBuildings} />}
              menu="Orgs & Employers"
              submenu={false}
            />
            <NavItem
              link="/"
              icon={<FontAwesomeIcon icon={faTicketsSimple} />}
              menu="Promo Codes"
              submenu={false}
            />
            <NavItem
              link="/"
              icon={<FontAwesomeIcon icon={faAt} />}
              menu="Trusted Domains"
              submenu={false}
            />
            <NavItem
              link="/"
              icon={<FontAwesomeIcon icon={faUserTieHairLong} />}
              menu="User Management"
              submenu={false}
            />
            <Divider />
            <NavItem
              link="/my-account"
              icon={<FontAwesomeIcon icon={faUsersRectangle} />}
              menu="My Account"
              submenu={false}
            />
            <NavItem
              link="/"
              icon={<FontAwesomeIcon icon={faArrowRightFromBracket} />}
              menu="Logout"
              submenu={false}
            />
          </nav>
        </div>
      </div>
    </section>
  );
};

export default GlobalNavigation;

export const NavItem: FC<NavItemProps> = ({ link, menu, icon, submenu, children }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const trigger = useRef<HTMLAnchorElement | null>(null);
  const dropdown = useRef<HTMLDivElement | null>(null);

  // close on click outside.
  useEffect(() => {
    const clickHandler = ({ target }: any) => {
      if (!dropdown.current) return;
      if (!dropdownOpen || dropdown.current.contains(target) || trigger.current?.contains(target))
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: any) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  return (
    <div className="relative">
      <Link
        href={link}
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className={cssUtil([
          dropdownOpen
            ? 'border-background-button-standard-primary-enabled-base bg-opacity-10 border-r-2 border-background-button-standard-primary-enabled-base bg-background-button-standard-primary-enabled-base text-background-button-standard-primary-enabled-base'
            : 'border-transparent text-body-color',
          'relative flex items-center border-r-2 py-[10px] pl-10 pr-11 text-base hover:text-background-button-standard-primary-enabled-base font-medium duration-200 hover:border-background-button-standard-primary-enabled-base hover:border-r-2 hover:bg-background-button-standard-primary-enabled-base hover:bg-opacity-10 hover:text-background-button-standard-primary-enabled-base',
        ])}
      >
        <div className="fa-fw">
          <div className="w-[20px]">{icon}</div>
        </div>
        <div className="w-[100%] items-center ml-3">{menu}</div>
        {submenu && (
          <span
            className={cssUtil([
              dropdownOpen === true ? 'rotate-0' : 'rotate-180',
              'absolute top-1/2 right-10 -translate-y-1/2',
            ])}
          >
            <FontAwesomeIcon icon={faChevronUp} />
          </span>
        )}
      </Link>
      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`${dropdownOpen === true ? 'block' : 'hidden'} `}
      >
        {submenu && <div className="py-1 pl-14 pr-10">{children}</div>}
      </div>
    </div>
  );
};

export const DropdownItem: FC<DropdownItemProps> = ({ link, menu }) => {
  return (
    <Link
      href={link}
      className="flex items-center border-r-4 border-transparent py-[10px] text-base font-medium text-body-color duration-200 hover:text-blue-900"
    >
      {menu}
    </Link>
  );
};

export const Divider = () => {
  return <div className="mx-10 my-3 h-[1px] bg-[#e7e7e7]"></div>;
};
