import { FC, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/pro-regular-svg-icons';

import MobileNavigation from './MobileNavigation';
import DesktopNavigation from './DesktopNavigation';
import SearchButton from './SearchButton';
import { NavProp } from './types';
import StandardPadding from '../StandardPadding/StandardPadding';

const Navigation: FC<NavProp> = ({ authenticated, displaySearch, setDisplaySearch, navItems }) => {
  const [dropdownMenu, setDropdownMenu] = useState(false);

  function dropdownMenuHandler() {
    setDropdownMenu(!dropdownMenu);
  }

  function displaySearchHandler() {
    setDisplaySearch(!displaySearch);
  }

  const { loggedIn, loggedOut } = navItems;

  let menu = authenticated ? loggedIn : loggedOut;

  return (
    <>
      <nav className="border-b border-slate-100 bg-shade-greyscale-white" data-testid="navigation">
        <StandardPadding className="flex justify-between">
          <div
            className="bg-[#252525] text-shade-greyscale-white w-[52px] h-[52px] leading-[52px] text-center p-3 overflow-hidden cursor-pointer flex desktop:hidden desktop:px-0 items-center"
            onClick={dropdownMenuHandler}
          >
            <FontAwesomeIcon icon={faBars} className="fa-solid fa-bars w-full h-full text-center" />
          </div>

          <DesktopNavigation menu={menu} />
          {authenticated && <SearchButton displaySearch={displaySearchHandler} />}
        </StandardPadding>
        {dropdownMenu && <MobileNavigation menu={menu} />}
      </nav>
    </>
  );
};

export default Navigation;
