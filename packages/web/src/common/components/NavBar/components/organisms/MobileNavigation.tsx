import React from 'react';
import { NavigationBarProps } from '../../types';
import NavigationMobileDropdown from '../molecules/NavigationMobileDropdown';
import NavigationMobileLink from '../atoms/NavigationMobileLink';

const MobileNavigation = ({ navigationItems }: NavigationBarProps) => {
  return (
    <div
      data-testid="mobile-navigation"
      className={`tablet:hidden rounded-b border-t-2 bg-dropDownItem-bg-colour dark:bg-dropDownItem-bg-colour-dark text-dropDownItem-text-colour dark:text-dropDownItem-text-colour-dark border-t-dropDownItem-border-active-colour dark:border-t-dropDownItem-border-active-colour-dark shadow-dropdownTop absolute w-full`}
    >
      {navigationItems.map((i) => {
        if (i.children && i.children.length > 0) {
          return <NavigationMobileDropdown key={`mobile-navigation-item-${i.id}`} item={i} />;
        } else {
          return <NavigationMobileLink item={i} key={`mobile-navigation-item-${i.id}`} />;
        }
      })}
    </div>
  );
};

export default MobileNavigation;
