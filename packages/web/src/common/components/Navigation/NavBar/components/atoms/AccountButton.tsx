import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faUser } from '@fortawesome/pro-solid-svg-icons';

type Props = {
  onClick: () => void;
  isToggled?: boolean;
};

const AccountButton = ({ isToggled, onClick }: Props) => {
  return (
    <button
      aria-label="My Account"
      className={`flex h-full justify-center items-center gap-1 cursor-pointer text-NavBar-icon-colour dark:text-NavBar-icon-colour-dark`}
      onClick={onClick}
      data-testid="mobile-nav-toggle-button"
    >
      <FontAwesomeIcon
        className="fa-lg"
        icon={isToggled ? faClose : faUser}
        width={24}
        height={24}
      />
    </button>
  );
};

export default AccountButton;
