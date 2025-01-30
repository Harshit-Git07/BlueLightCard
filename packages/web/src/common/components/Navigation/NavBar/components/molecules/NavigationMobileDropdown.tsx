import React, { useState } from 'react';
import { NavigationItemProps } from '../../types';
import Link from '../../../../Link/Link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-solid-svg-icons';
import { useNavigationTracking } from '../../hooks/useNavigationTracking';

const NavigationMobileDropdown = ({ item }: NavigationItemProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { trackNavigationEvent } = useNavigationTracking();
  const handleClick = () => {
    setShowDropdown(!showDropdown);
  };
  const onSubItemClick = (id: string, onClick?: () => void) => {
    if (onClick) {
      onClick();
    }
    trackNavigationEvent(id);
    setShowDropdown(false);
  };
  return (
    <>
      <button
        aria-label="Toggle dropdown"
        aria-haspopup="true"
        aria-expanded={showDropdown}
        className="flex items-center px-5 h-10 w-full border border-dropDownItem-bg-colour font-dropDownItem-label-font font-dropDownItem-label-font-weight text-dropDownItem-label-font tracking-dropDownItem-label-font leading-dropDownItem-label-font dark:border-dropDownItem-bg-colour-dark cursor-pointer"
        onClick={handleClick}
      >
        <Link
          className={`flex h-full justify-center items-center gap-1 font-dropDownItem-label-font font-dropDownItem-label-font-weight text-dropDownItem-label-font tracking-dropDownItem-label-font leading-dropDownItem-label-font ${
            showDropdown
              ? 'text-dropDownItem-text-active-colour dark:text-dropDownItem-text-active-colour-dark'
              : ''
          }`}
        >
          {item.label}
          {<FontAwesomeIcon icon={showDropdown ? faChevronUp : faChevronDown} />}
        </Link>
      </button>
      {showDropdown && (
        <ul className="border-t border-t-dropDownItem-border-active-colour dark:border-t-dropDownItem-border-active-colour-dark">
          {item.children?.map(({ id, url, onClick, label }) => (
            <li
              key={`mobile-nav-dropdown-${id}`}
              className="flex items-center px-5 h-10 bg-dropDownItem-subitem-bg-colour dark:bg-dropDownItem-subitem-bg-colour-dark"
            >
              <Link
                href={url}
                onClick={() => onSubItemClick(id, onClick)}
                className="text-dropDownItem-text-colour font-dropDownItem-label-font font-dropDownItem-label-font-weight text-dropDownItem-label-font tracking-dropDownItem-label-font leading-dropDownItem-label-font dark:text-dropDownItem-text-colour-dark"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default NavigationMobileDropdown;
