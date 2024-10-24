import { FC } from 'react';
import { NotificationItemProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/pro-regular-svg-icons';
import { faBell as fallBellSolid } from '@fortawesome/pro-solid-svg-icons/faBell';

const NotificationItem: FC<NotificationItemProps> = ({
  id,
  title,
  subtext,
  isClicked,
  onClick,
}) => {
  const handleClick = async () => {
    if (onClick) {
      await onClick(id);
    }
  };

  return (
    <button className="flex cursor-pointer text-left py-2.5 px-4" onClick={handleClick}>
      <FontAwesomeIcon
        icon={isClicked ? faBell : fallBellSolid}
        size="lg"
        className="text-colour-primary-light dark:text-colour-primary-dark mt-1.5"
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
