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
      onClick={onIconClick}
      data-testid="mobile-nav-toggle-button"
      aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isMenuOpen}
    >
      <FontAwesomeIcon
        icon={isMenuOpen ? faClose : faBars}
        width={24}
        height={24}
        className="fa-lg"
      />
    </button>
  );
};

export default MobileNavToggleButton;
