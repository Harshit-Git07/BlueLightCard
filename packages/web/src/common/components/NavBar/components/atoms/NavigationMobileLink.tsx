import React from 'react';
import { NavigationItemProps } from '../../types';
import Link from '../../../Link/Link';
import { useNavigationTracking } from '../../hooks/useNavigationTracking';

const NavigationMobileLink = ({ item }: NavigationItemProps) => {
  const { trackNavigationEvent } = useNavigationTracking();
  return (
    <Link
      className="flex w-full border border-dropDownItem-bg-colour dark:border-dropDownItem-bg-colour-dark items-center px-5 h-10"
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

export default NavigationMobileLink;
