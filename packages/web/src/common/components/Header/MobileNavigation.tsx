import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/pro-regular-svg-icons';
import { FC } from 'react';
import { MenuNavProps } from './types';

const downArrow = <FontAwesomeIcon icon={faAngleDown} size="sm" className="pl-1" />;

const MobileNavigation: FC<MenuNavProps> = ({ menu }) => (
  <div className="flex-col absolute z-[100] w-full desktop:hidden" data-testid="mobileNav">
    <ul className="bg-[#f8f8f8]">
      {menu.map((navItem, index) => {
        const hasDropdown = navItem.dropdown?.length && navItem.dropdown.length > 0;
        return (
          <li className="block w-full border-b-[#eee] border-b border-solid group" key={index}>
            <Link
              href={navItem.link}
              className="block w-full border-b-[#eee] border-b border-solid pt-4 pb-4 pl-5 text-base text-palette-body-text hover:text-[#36c]"
            >
              {navItem.text}
              {hasDropdown && downArrow}
            </Link>
            {hasDropdown && (
              <ul className="list-none relative z-[999] hidden min-w-[180px] border-t-2 border-solid group-hover:block bg-shade-greyscale-white w-full">
                {navItem.dropdown?.map((link, index) => (
                  <li
                    className="block w-full border-b-[#eee] border-b border-solid relative"
                    key={index}
                  >
                    <Link
                      href={link.link}
                      className="font-normal text-palette-body-text inline-block bg-shade-greyscale-white px-5 py-2 hover:text-[#36c]"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
                <hr />
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  </div>
);

export default MobileNavigation;
