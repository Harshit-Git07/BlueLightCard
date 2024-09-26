import { FC, useState } from 'react';
import { NotificationItemProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/pro-regular-svg-icons';
import { faBell as fallBellSolid } from '@fortawesome/pro-solid-svg-icons/faBell';

const NotificationItem: FC<NotificationItemProps> = ({ title, subtext, onClick }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
      setIsClicked(!isClicked);
    }
  };

  return (
    <button className="flex cursor-pointer text-left" onClick={handleClick}>
      <FontAwesomeIcon
        icon={isClicked ? faBell : fallBellSolid}
        size="xl"
        className="text-colour-primary-light dark:text-colour-primary-dark"
      />
      <div className="flex flex-col pl-2">
        <p className="text-colour-primary-light dark:text-colour-primary-dark font-typography-body font-typography-body-weight text-typography-body leading-typography-body tracking-typography-body line-clamp-2">
          {title}
        </p>
        <p className="text-colour-onSurface-subtle-light dark:text-colour-onSurface-subtle-dark font-typography-label font-typography-label-weight text-typography-label leading-typography-label tracking-typography-label">
          {subtext}
        </p>
      </div>
    </button>
  );
};

export default NotificationItem;
