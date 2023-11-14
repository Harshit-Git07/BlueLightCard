import Link from '@/components/Link/Link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/pro-regular-svg-icons';
import { FC } from 'react';
import { MenuNavProps } from './types';
import isTimeLockRouteUnlocked from '@/utils/isTimeLockRouteUnlocked';

const downArrow = (
  <FontAwesomeIcon icon={faAngleDown} size="sm" className="relative pl-1 top-[2px]" />
);

const MobileNavigation: FC<MenuNavProps> = ({ menu }) => (
  <div className="flex-col absolute z-[100] w-full desktop:hidden" data-testid="mobileNav">
    <ul className="bg-[#f8f8f8]">
      {menu.map((navItem, index) => {
        const hasDropdown = navItem.dropdown?.length && navItem.dropdown.length > 0;
        const hasTimeLock = navItem?.startTime || navItem?.endTime;

        if (hasTimeLock && !isTimeLockRouteUnlocked(navItem)) {
          return null;
        }

        return (
          <li className="block w-full border-b-[#eee] border-b border-solid group" key={index}>
            <Link
              href={navItem.link || '#'}
              className="block w-full border-b-[#eee] border-b border-solid pt-4 pb-4 pl-5 text-base text-palette-body-text hover:text-[#36c]"
              useLegacyRouting={navItem.link ? navItem.link.includes('.php') : true}
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
                      useLegacyRouting={link.link.includes('.php')}
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
