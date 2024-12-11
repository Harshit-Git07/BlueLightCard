import React from 'react';
import { NavigationBarProps } from '../../../types';
import NavigationMobileDropdown from '../../molecules/NavigationMobileDropdown';
import NavigationMobileLink from '../../atoms/NavigationMobileLink';

const MobileNavigation = ({ navigationItems }: NavigationBarProps) => {
  return (
    <div
      data-testid="mobile-navigation"
      className={`z-30 rounded-b-md border-t-2 bg-dropDownItem-bg-colour dark:bg-dropDownItem-bg-colour-dark text-dropDownItem-text-colour dark:text-dropDownItem-text-colour-dark border-t-dropDownItem-border-active-colour dark:border-t-dropDownItem-border-active-colour-dark shadow-dropdownTop absolute mobile:w-full tablet:w-fit tablet:right-[48px] tablet:top-[82px]`}
    >
      {navigationItems.map((item) => {
        if (item.children && item.children.length > 0) {
          return <NavigationMobileDropdown key={`mobile-navigation-item-${item.id}`} item={item} />;
        } else {
          return <NavigationMobileLink item={item} key={`mobile-navigation-item-${item.id}`} />;
        }
      })}
    </div>
  );
};

export default MobileNavigation;
