import React, { FC, useState } from 'react';
import Logo from './Logo';

import BellIcon from './BellIcon';
import { HeaderProps } from './types';

import Navigation from './Navigation';
import Search from './Search';
import SelectCountry from './SelectCountry';

const Header: FC<HeaderProps> = ({
  loggedIn = false,
  logoUrl,
  navItems,
  onSearchCompanyChange,
  onSearchCategoryChange,
  onSearchTerm,
}) => {
  const [displaySearch, setDisplaySearch] = useState(false);

  return (
    <div>
      <div
        className="bg-palette-primary-base dark:bg-palette-primary-dark p-4 relative dark:"
        data-testid="app-header"
      >
        <div className="mx-auto flex justify-between items-center tablet:px-[9%]">
          <div className="flex-1">
            <Logo logoUrl={logoUrl} />
          </div>
          {loggedIn ? <BellIcon /> : <SelectCountry />}
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
