import React from 'react';
import { NavigationItemProps } from '../../../types';
import Link from '../../../../../Link/Link';
import { useNavigationTracking } from '../../../hooks/useNavigationTracking';

const NavigationLink = ({ item, onBack }: NavigationItemProps) => {
  const { trackNavigationEvent } = useNavigationTracking();
  return (
    <Link
      tabIndex={0}
      useLegacyRouting={false}
      className={`flex justify-between min-w-fit items-center gap-1 font-NavBar-link-font font-NavBar-link-font-weight text-NavBar-link-font tracking-NavBar-link-font leading-NavBar-link-font cursor-pointer border-b border-transparent hover:text-NavBar-link-hover-colour hover:border-b-NavBar-link-hover-colour dark:hover:text-NavBar-link-hover-colour-dark dark:hover:border-b-NavBar-link-hover-colour-dark`}
      href={item?.url}
      onClickLink={() => {
        if (item.onClick) {
          item.onClick();
        }
        trackNavigationEvent(item.id);
        onBack && onBack();
      }}
      data-testid={`navigationLink-${item.id}`}
    >
      {item.label}
    </Link>
  );
};

export default NavigationLink;
