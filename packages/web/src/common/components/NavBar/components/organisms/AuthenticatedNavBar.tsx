import React, { useState } from 'react';
import DesktopNavigation from './DesktopNavigation';
import SearchButton from '../atoms/SearchButton';
import NotificationButton from '../atoms/NotificationButton';
import MobileNavToggleButton from '../atoms/MobileNavToggleButton';
import { AuthenticatedNavBarProps } from '../../types';
import MobileNavigation from './MobileNavigation';
import Logo from '@/components/Logo';
import Search from '../../../Header/Search';

const AuthenticatedNavBar = ({
  onSearchCategoryChange,
  onSearchCompanyChange,
  onSearchTerm,
  navigationItems,
  isSticky,
}: AuthenticatedNavBarProps) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [displaySearch, setDisplaySearch] = useState(false);

  const onShowMobileMenuClick = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <div data-testid="authenticated-navbar">
      <div
        className={`bg-NavBar-bg-colour dark:bg-NavBar-bg-colour-dark text-NavBar-item-text-colour dark:text-NavBar-item-text-colour-dark ${
          isSticky && !showMobileMenu
            ? 'border-b border-b-colour-onSurface-outline dark:border-b-colour-onSurface-outline-dark'
            : ''
        }`}
      >
        <div className="h-[72px] px-4 tablet:px-14 laptop:container laptop:mx-auto flex justify-between items-center">
          <Logo className="h-[35px] tablet:h-[42px] laptop:h-[55px]" url="/members-home" />
          <div className="flex gap-7 h-full items-center">
            <div className="hidden laptop:flex laptop:h-full">
              <DesktopNavigation navigationItems={navigationItems} />
            </div>
            <div className="flex gap-5">
              <SearchButton onIconClick={() => setDisplaySearch(!displaySearch)} />
              <NotificationButton href="/notifications.php" />
              <MobileNavToggleButton
                onIconClick={onShowMobileMenuClick}
                isMenuOpen={showMobileMenu}
              />
            </div>
          </div>
        </div>
        <div className="h-[72px] hidden tablet:px-14 tablet:flex laptop:hidden laptop:mx-auto">
          <DesktopNavigation navigationItems={navigationItems} />
        </div>
      </div>
      {showMobileMenu && <MobileNavigation navigationItems={navigationItems} />}
      {/* TO-DO Replace Old Search With New Search */}
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

export default AuthenticatedNavBar;
