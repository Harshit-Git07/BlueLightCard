import React, { useState, useRef, useEffect } from 'react';
import { TableDropdownProps } from './types';

export const TableDropdown: React.FC<TableDropdownProps> = ({ items, rowData }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const dropdown = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target as Node) ||
        trigger.current?.contains(target as Node)
      ) {
        return;
      }
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  useEffect(() => {
    const keyHandler = (event: KeyboardEvent) => {
      if (!dropdownOpen || event.key !== 'Escape') return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  return (
    <div className="relative">
      <button
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="text-body-color dark:text-black"
        aria-haspopup="true"
        aria-expanded={dropdownOpen}
      >
        <svg
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12Z"
            fill="currentColor"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10 5C10 3.89543 10.8954 3 12 3C13.1046 3 14 3.89543 14 5C14 6.10457 13.1046 7 12 7C10.8954 7 10 6.10457 10 5Z"
            fill="currentColor"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10 19C10 17.8954 10.8954 17 12 17C13.1046 17 14 17.8954 14 19C14 20.1046 13.1046 21 12 21C10.8954 21 10 20.1046 10 19Z"
            fill="currentColor"
          />
        </svg>
      </button>
      {dropdownOpen && (
        <div
          ref={dropdown}
          className="absolute right-0 top-full z-40 w-[200px] space-y-1 rounded bg-white p-2 shadow-card dark:bg-dark border-stroke dark:border-dark-3 border"
          role="menu"
        >
          {items.map(
            (item, index) =>
              item.condition?.(rowData) !== false && (
                <button
                  key={index}
                  className="w-full px-3 py-2 text-sm text-left rounded text-body-color hover:bg-gray-2 dark:text-black dark:hover:bg-dark-2"
                  onClick={() => {
                    item.onClick();
                    setDropdownOpen(false);
                  }}
                  role="menuitem"
                >
                  {item.label}
                </button>
              ),
          )}
        </div>
      )}
    </div>
  );
};
