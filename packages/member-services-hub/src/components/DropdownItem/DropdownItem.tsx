import React from 'react';
import { FC } from 'react';
import { DropdownProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/pro-regular-svg-icons';

export const DropdownItem: FC<DropdownProps> = ({ name, link, id }) => {
  return (
    <a
      id={id}
      href={link}
      className="block rounded pl-2 pr-6 py-2 text-sm font-medium font-museosans text-background-button-standard-primary-enabled-base hover:text-primary hover:bg-background-button-standard-primary-enabled-base hover:bg-opacity-30 inline-flex"
    >
      {' '}
      <FontAwesomeIcon
        icon={faUser}
        style={{ color: 'background-button-standard-primary-enabled-base' }}
        size="lg"
      />
      <div className="ml-3">{name}</div>
    </a>
  );
};

export default DropdownItem;
