import React from 'react';
import { NavigationItemProps } from '../../types';
import Link from '../../../Link/Link';
import { useNavigationTracking } from '../../hooks/useNavigationTracking';

const NavigationLink = ({ item }: NavigationItemProps) => {
  const { trackNavigationEvent } = useNavigationTracking();
  return (
    <Link
      tabIndex={0}
      useLegacyRouting={false}
      className={`flex justify-between items-center gap-1 cursor-pointer border border-NavBar-bg-colour dark:border-NavBar-bg-colour-dark hover:text-NavBar-link-hover-colour hover:border-b-header-NavBar-hover-colour dark:hover:text-NavBar-link-hover-colour-dark dark:hover:border-b-NavBar-link-hover-colour-dark`}
      href={item?.url}
      onClickLink={() => {
        if (item.onClick) {
          item.onClick();
        }
        trackNavigationEvent(item.id);
      }}
    >
      {item.label}
    </Link>
  );
};

export default NavigationLink;
