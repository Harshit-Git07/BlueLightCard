import React from 'react';
import Link from '@/components/Link/Link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/pro-solid-svg-icons';

type Props = {
  href: string;
};

const NotificationButton = ({ href }: Props) => {
  return (
    <Link
      href={href}
      aria-label="Notifications"
      className={`flex h-full justify-center items-center gap-1 cursor-pointer text-NavBar-icon-colour hover:text-NavBar-link-hover-colour dark:text-NavBar-icon-colour-dark dark:hover:text-NavBar-link-hover-colour-dark`}
    >
      <FontAwesomeIcon icon={faBell} />
    </Link>
  );
};

export default NotificationButton;
