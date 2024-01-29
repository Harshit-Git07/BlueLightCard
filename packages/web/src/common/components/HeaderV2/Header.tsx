import React, { FC } from 'react';

// Original header imports
import Logo from '../Header/Logo';
import BellIcon from '../Header/BellIcon';
import SelectCountry from '../Header/SelectCountry';

// New header imports
import { HeaderProps } from './types';
import Navigation from './Navigation';

const Header: FC<HeaderProps> = ({ loggedIn = false, navItems }) => {
  const { links } = navItems;

  return (
    <div>
      <div
        className="h-[72px] bg-palette-primary-base dark:bg-palette-primary-dark p-4 relative dark:"
        data-testid="app-header"
      >
        <div className="laptop:container laptop:mx-auto flex justify-between items-center">
          <div className="flex-1">
            <Logo url={links.homeUrl} />
          </div>
          {loggedIn ? <BellIcon url={links.notificationsUrl} /> : <SelectCountry />}
        </div>
      </div>
      <Navigation authenticated={loggedIn} navItems={navItems} />
    </div>
  );
};

export default Header;
