import React from 'react';
import { NavigationBarProps } from '../../../types';
import NavigationLink from '../../atoms/NavigationLink';
import NavigationDropdown from '../../molecules/NavigationDropdown';

const DesktopNavigation = ({ navigationItems, onBack }: NavigationBarProps) => {
  return (
    <div className="flex flex-1 gap-5 h-full justify-between">
      {navigationItems.map((i) => {
        if (i.children && i.children.length > 0) {
          return (
            <NavigationDropdown item={i} key={`desktop-navigation-item-${i.id}`} onBack={onBack} />
          );
        } else {
          return (
            <NavigationLink item={i} key={`desktop-navigation-item-${i.id}`} onBack={onBack} />
          );
        }
      })}
    </div>
  );
};

export default DesktopNavigation;
