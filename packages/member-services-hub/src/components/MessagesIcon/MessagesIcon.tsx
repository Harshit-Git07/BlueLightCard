import React from 'react';
import { FC } from 'react';
import { MessagesIconProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/pro-regular-svg-icons';

export const MessagesIcon: FC<MessagesIconProps> = ({ id, show }) => {
  if (show) {
    return (
      <button id={id} className="text-body-color hover:text-primary">
        <FontAwesomeIcon icon={faEnvelope} size="lg" />
      </button>
    );
  } else {
    return <div></div>;
  }
};

export default MessagesIcon;
