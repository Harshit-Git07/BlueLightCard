import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/pro-solid-svg-icons';
import Link from '@/components/Link/Link';
import { useLogGlobalNavigationOffersClicked } from '@/hooks/useLogGlobalNavigation';

interface BellIconProps {
  url: string;
}

const BellIcon: React.FC<BellIconProps> = ({ url }) => {
  const { logNotificationsClicked } = useLogGlobalNavigationOffersClicked();
  const onNotificationsClick = async () => {
    await logNotificationsClicked();
    window.location.href = url;
  };

  return (
    <Link href={url} aria-label="Notification's" onClickLink={onNotificationsClick}>
      <FontAwesomeIcon
        icon={faBell}
        className="text-palette-white h-[20px] cursor-pointer hover:text-palette-secondary ease-in duration-100"
        data-testid="bell-icon"
      />
    </Link>
  );
};

export default BellIcon;
