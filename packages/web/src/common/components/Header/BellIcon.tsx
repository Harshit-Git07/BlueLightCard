import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/pro-solid-svg-icons';
import Link from 'next/link';

const BellIcon: React.FC = () => (
  <Link legacyBehavior href="/">
    <FontAwesomeIcon
      icon={faBell}
      className="text-palette-white h-[20px] cursor-pointer hover:text-palette-secondary ease-in duration-100"
      data-testid="bellicon"
    />
  </Link>
);

export default BellIcon;
