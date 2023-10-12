import React from 'react';
import { FC } from 'react';
import { CalenderIconProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/pro-regular-svg-icons';

export const CalenderIcon: FC<CalenderIconProps> = ({ id, show }) => {
  if (show) {
    return (
      <button id={id} className="text-body-color hover:text-primary">
        <FontAwesomeIcon icon={faCalendar} size="lg" />
      </button>
    );
  } else {
    return <div></div>;
  }
};

export default CalenderIcon;
