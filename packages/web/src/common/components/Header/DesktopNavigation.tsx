import Link from '@/components/Link/Link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/pro-regular-svg-icons';
import { FC } from 'react';
import { MenuNavProps } from './types';

const downArrow = <FontAwesomeIcon icon={faAngleDown} size="sm" className="pl-1" />;

const DesktopNavigation: FC<MenuNavProps> = ({ menu }) => {
  return (
    <ul className="hidden desktop:flex py-3" data-testid="desktopNav">
      {menu.map((navItem, index) => {
        const hasDropdown = navItem.dropdown?.length && navItem.dropdown.length > 0;

        return (
          <li className="px-3 group" key={index}>
            <Link
              href={navItem.link}
              data-testid={navItem.text + '-link'}
              className="block hover:underline hover:text-[#36c] text-palette-body-text"
              useLegacyRouting={navItem.link ? navItem.link.includes('.php') : true}
            >
              {navItem.text} {hasDropdown && downArrow}
            </Link>

            {hasDropdown && (
              <div className="z-100 absolute ease-in duration-300">
                <ul className="list-none absolute z-[999] hidden min-w-[180px] h-auto shadow-[0px_6px_12px_rgba(0,0,0,0.176)] m-0 rounded-[0_0_3px_3px] border-t-2 border-solid -left-5 top-0 group-hover:block bg-shade-greyscale-white">
                  {navItem.dropdown?.map((link, index) => (
                    <li
                      className="leading-[normal] text-sm relative font-normal group-hover:block hover:z-1000"
                      key={index}
                    >
                      <Link
                        href={link.link}
                        data-testid={link.text + '-link'}
                        className="text-base text-palette-body-text hover:text-[#36c] block whitespace-nowrap no-underline px-5 py-2.5 border-b-[rgba(0,0,0,0.05)] border-b border-solid bg-shade-greyscale-white"
                        useLegacyRouting={link.link ? link.link.includes('.php') : true}
                      >
                        {link.text}
                      </Link>
                    </li>
                  ))}
                  <hr />
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default DesktopNavigation;
