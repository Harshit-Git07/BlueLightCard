import React, { useState } from 'react';
import { FC } from 'react';
import { DropdownProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/pro-regular-svg-icons';
import { cssUtil } from '@/app/common/utils/cssUtil';
import Link from 'next/link';
export const DropdownItem: FC<DropdownProps> = ({ name, link, id }) => {
  const [itemClicked, setItemClicked] = useState(false);
  return (
    <Link
      id={id}
      href={link}
      className={cssUtil([
        ' w-full px-[20px] py-2 text-sm font-normal font-museosans  inline-flex',
        itemClicked
          ? 'text-background-button-standard-primary-enabled-base text-primary bg-background-button-standard-primary-enabled-base bg-opacity-10'
          : 'text-body-color',
      ])}
      onClick={() => setItemClicked(!itemClicked)}
    >
      {' '}
      <FontAwesomeIcon
        icon={faUser}
        style={{ color: 'background-button-standard-primary-enabled-base' }}
        size="lg"
      />
      <div className="ml-3">{name}</div>
    </Link>
  );
};

export default DropdownItem;
