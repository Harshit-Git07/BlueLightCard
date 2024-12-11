import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-solid-svg-icons';
import { NavigationItemProps } from '../../../types';
import { useNavigationTracking } from '../../../hooks/useNavigationTracking';
import Link from '../../../../Link/Link';
import LinkList from '../../../../LinkList/LinkList';

const NavigationDropdown = ({ item, onBack }: NavigationItemProps) => {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const dropdownTriggerRef = React.useRef<HTMLButtonElement>(null);
  const [top, setTop] = React.useState(0);
  const { trackNavigationEvent } = useNavigationTracking();

  useEffect(() => {
    // This use effect is used to be able to adjust the starting position of the dropdown dependant on the trigger that is used.
    const updateDropdownPosition = () => {
      if (!dropdownTriggerRef.current) return;
      const triggerHeight = dropdownTriggerRef.current.offsetHeight;
      setTop(triggerHeight);
    };
    updateDropdownPosition();

    window.addEventListener('resize', updateDropdownPosition);

    return () => {
      window.removeEventListener('resize', updateDropdownPosition);
    };
  }, []);

  const hideDropdowns = () => {
    setShowDropdown(false);
  };

  useEffect(() => {
    // This use effect handles the clicking outside of the dropdown to close it. Ensuring only one is open at most.
    const handleClick = (event: MouseEvent) => {
      if (!dropdownTriggerRef.current) return;
      if (dropdownTriggerRef.current.contains(event.target as Node)) {
        setShowDropdown(!showDropdown);
      } else {
        setShowDropdown(false);
      }
    };
    if (!dropdownRef.current) return;
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [dropdownRef, showDropdown]);

  return (
    <div ref={dropdownRef} className="relative" data-testid={`navigation-dropdown-${item.id}`}>
      <button
        ref={dropdownTriggerRef}
        aria-label="Toggle dropdown"
        aria-haspopup="true"
        aria-expanded={showDropdown}
        className="h-full w-full"
      >
        <Link
          className={`flex h-full min-w-fit justify-center items-center gap-1 border-b border-transparent font-NavBar-link-font font-NavBar-link-font-weight text-NavBar-link-font tracking-NavBar-link-font leading-NavBar-link-font cursor-pointer ${
            showDropdown
              ? 'text-NavBar-item-text-active-colour dark:text-NavBar-item-text-active-colour-dark'
              : 'hover:text-NavBar-link-hover-colour hover:border-b-NavBar-link-hover-colour dark:hover:text-NavBar-link-hover-colour-dark dark:hover:border-b-NavBar-link-hover-colour-dark'
          }`}
        >
          <p>{item.label}</p>
          <FontAwesomeIcon icon={showDropdown ? faChevronUp : faChevronDown} className="ml-[8px]" />
        </Link>
      </button>
      {showDropdown && (
        <LinkList
          items={
            item.children
              ? item.children.map((i) => ({
                  ...i,
                  onClick: () => {
                    if (i.onClick) {
                      i.onClick();
                    }
                    trackNavigationEvent(i.id);
                    hideDropdowns();
                    onBack && onBack();
                  },
                }))
              : []
          }
          styling={{
            top: `${top}px`,
            position: 'absolute',
            zIndex: 20,
          }}
        />
      )}
    </div>
  );
};

export default NavigationDropdown;
