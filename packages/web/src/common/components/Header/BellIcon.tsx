import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/pro-solid-svg-icons';
import Link from '@/components/Link/Link';

interface BellIconProps {
  url: string;
}

const BellIcon: React.FC<BellIconProps> = ({ url }) => (
  <Link href={url} aria-label="Notification's">
    <FontAwesomeIcon
      icon={faBell}
      className="text-palette-white h-[20px] cursor-pointer hover:text-palette-secondary ease-in duration-100"
      data-testid="bell-icon"
    />
  </Link>
);

export default BellIcon;
