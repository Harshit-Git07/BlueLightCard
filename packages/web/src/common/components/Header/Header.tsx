import React, { FC, useState } from 'react';
import Logo from './Logo';

import BellIcon from './BellIcon';
import { HeaderProps } from './types';

import Navigation from './Navigation';
import Search from './Search';
import SelectCountry from './SelectCountry';

const Header: FC<HeaderProps> = ({
  loggedIn = false,
  navItems,
  onSearchCompanyChange,
  onSearchCategoryChange,
  onSearchTerm,
}) => {
  const [displaySearch, setDisplaySearch] = useState(false);

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
      <Navigation
        authenticated={loggedIn}
        displaySearch={displaySearch}
        setDisplaySearch={setDisplaySearch}
        navItems={navItems}
      />
      {displaySearch && (
        <Search
          onSearchCompanyChange={onSearchCompanyChange}
          onSearchCategoryChange={onSearchCategoryChange}
          onSearchTerm={onSearchTerm}
        />
      )}
    </div>
  );
};

export default Header;
