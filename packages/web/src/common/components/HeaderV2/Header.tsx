import React, { FC } from 'react';

// Original header imports
import Logo from '../Header/Logo';
import BellIcon from '../Header/BellIcon';
import SelectCountry from '../Header/SelectCountry';

// New header imports
import { HeaderProps } from './types';
import Navigation from './Navigation';
import { navLinks } from '@/data/headerConfig';

const Header: FC<HeaderProps> = ({ loggedIn = false }) => (
  <div>
    <div
      className="h-[72px] bg-palette-primary-base dark:bg-palette-primary-dark p-4 relative dark:"
      data-testid="app-header"
    >
      <div className="laptop:container laptop:mx-auto flex justify-between items-center">
        <div className="flex-1 bg-surface-brand">
          <Logo url={navLinks.homeUrl} />
        </div>
        {loggedIn ? <BellIcon url={navLinks.notificationsUrl} /> : <SelectCountry />}
      </div>
    </div>
    <Navigation authenticated={loggedIn} />
  </div>
);

export default Header;
