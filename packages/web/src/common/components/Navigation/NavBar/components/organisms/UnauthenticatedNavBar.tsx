import React, { useState } from 'react';
import { UnauthenticatedNavBarProps } from '../../types';
import Logo from '@/components/Logo';
import { BRAND } from '@/global-vars';
import MobileNavToggleButton from '../atoms/MobileNavToggleButton';
import Button from '@bluelightcard/shared-ui/components/Button-V2';
import { ThemeVariant } from '@bluelightcard/shared-ui/types';
import { BRANDS } from '@/root/src/common/types/brands.enum';
import DDSLogos from '../molecules/DDSLogos';
import MobileNavigation from './MobileNavigation';
import { NavBar } from '@bluelightcard/shared-ui';

const UnauthenticatedNavBar = ({ navigationItems, isSticky }: UnauthenticatedNavBarProps) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const onShowMobileMenuClick = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <div data-testid="unauthenticated-navbar">
      <div
        className={`dark:bg-NavBar-bg-colour-dark bg-NavBar-bg-colour text-NavBar-item-text-colour dark:text-NavBar-item-text-colour-dark ${
          isSticky && !showMobileMenu
            ? 'border-b border-b-colour-onSurface-outline dark:border-b-colour-onSurface-outline-dark'
            : ''
        }`}
      >
        <div className="h-[72px] px-4 tablet:px-14 laptop:container laptop:mx-auto flex justify-between items-center">
          <Logo className="h-[35px] tablet:h-[42px] laptop:h-[55px]" url="/members-home" />
          <div className="flex gap-7 h-full items-center">
            <div className="hidden desktop:flex desktop:h-full">
              <NavBar links={navigationItems} />
            </div>
            <div className="flex gap-2 items-center">
              <div className="hidden tablet:flex tablet:gap-2 tablet:items-center">
                <div className="hidden tablet:flex desktop:hidden">
                  {(BRAND as BRANDS) === BRANDS.DDS_UK && <DDSLogos />}
                </div>
                <Button variant={ThemeVariant.Secondary} size="Large">
                  Log in
                </Button>
                <Button size="Large">Sign up</Button>
              </div>
              <div className="hidden desktop:flex">
                {(BRAND as BRANDS) === BRANDS.DDS_UK && <DDSLogos />}
              </div>
              <MobileNavToggleButton
                onIconClick={onShowMobileMenuClick}
                isMenuOpen={showMobileMenu}
              />
            </div>
          </div>
        </div>
        <div className="h-[72px] hidden tablet:px-14 tablet:flex desktop:hidden desktop:mx-auto">
          <NavBar links={navigationItems} />
        </div>
      </div>
      {showMobileMenu && (
        <MobileNavigation
          navigationItems={navigationItems}
          unauthenticatedProps={{ brand: BRAND }}
        />
      )}
    </div>
  );
};

export default UnauthenticatedNavBar;
