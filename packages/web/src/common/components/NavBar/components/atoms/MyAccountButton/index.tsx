import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/pro-solid-svg-icons';
import Link from '../../../../Link/Link';

type Props = {
  href: string;
  onClick?: () => void;
};

const MyAccountButton = ({ href, onClick }: Props) => {
  return (
    <>
      <button className="tablet:hidden" onClick={onClick} aria-label="My account">
        <FontAwesomeIcon icon={faUser} className="fa-lg" />
      </button>
      <Link
        className={`hidden tablet:inline hover:text-NavBar-link-hover-colour dark:hover:text-NavBar-link-hover-colour-dark`}
        href={href}
        aria-label="My account"
      >
        <FontAwesomeIcon icon={faUser} className="fa-lg" width={24} height={24} />
      </Link>
    </>
  );
};

export default MyAccountButton;
