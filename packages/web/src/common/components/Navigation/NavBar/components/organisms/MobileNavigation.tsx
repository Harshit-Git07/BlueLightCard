import React from 'react';
import { MobileNavigationBarProps } from '../../types';
import Button from '@bluelightcard/shared-ui/components/Button-V2';
import { ThemeVariant } from '@bluelightcard/shared-ui/types';
import DDSLogos from '../molecules/DDSLogos';
import { BRANDS } from '@/root/src/common/types/brands.enum';
import { NavBar } from '@bluelightcard/shared-ui';

const MobileNavigation = ({ navigationItems, unauthenticatedProps }: MobileNavigationBarProps) => {
  const isAuthenticated = !unauthenticatedProps;

  return (
    <div
      data-testid="mobile-navigation"
      className="z-30 rounded-b border-t-2 bg-dropDownItem-bg-colour dark:bg-dropDownItem-bg-colour-dark text-dropDownItem-text-colour dark:text-dropDownItem-text-colour-dark border-t-dropDownItem-border-active-colour dark:border-t-dropDownItem-border-active-colour-dark shadow-dropdownTop absolute w-full top-16 left-0"
    >
      <NavBar links={navigationItems} />
      {!isAuthenticated && (
        <div className="flex p-5 flex-col items-start gap-4">
          <Button variant={ThemeVariant.Secondary} size="Large" className="w-full">
            Log in
          </Button>
          <Button size="Large" className="w-full">
            Sign up
          </Button>
          {unauthenticatedProps.brand === BRANDS.DDS_UK && (
            <div className="flex w-full">
              <DDSLogos />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MobileNavigation;
