import React from 'react';
import { FC } from 'react';
import { NotificationsIconProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/pro-regular-svg-icons';

export const NotificationsIcon: FC<NotificationsIconProps> = ({ id, show }) => {
  if (show) {
    return (
      <button id={id} className="text-body-color hover:text-primary">
        <FontAwesomeIcon icon={faBell} size="lg" />
      </button>
    );
  } else {
    return <div></div>;
  }
};

export default NotificationsIcon;
