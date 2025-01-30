import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faClose } from '@fortawesome/pro-solid-svg-icons';

type Props = {
  onIconClick: () => void;
  isMenuOpen?: boolean;
};

const MobileNavToggleButton = ({ isMenuOpen, onIconClick }: Props) => {
  return (
    <button
      className={`flex h-full justify-center items-center gap-1 cursor-pointer tablet:hidden text-NavBar-icon-colour dark:text-NavBar-icon-colour-dark`}
      onClick={onIconClick}
      data-testid="mobile-nav-toggle-button"
    >
      <FontAwesomeIcon icon={isMenuOpen ? faClose : faBars} />
    </button>
  );
};

export default MobileNavToggleButton;
