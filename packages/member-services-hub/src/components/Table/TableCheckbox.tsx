import React from 'react';
import { TableCheckboxProps } from '@/components/Table/types';

export const TableCheckbox: React.FC<TableCheckboxProps> = ({ id, isChecked, onChange, label }) => {
  return (
    <div className="relative">
      <label htmlFor={`checkbox-${id}`} className="flex items-center cursor-pointer">
        <input
          type="checkbox"
          name="tableCheckbox"
          id={`checkbox-${id}`}
          className="sr-only"
          checked={isChecked}
          onChange={onChange}
        />
        <span
          className={`flex h-[18px] w-[18px] items-center justify-center rounded border ${
            isChecked ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'
          }`}
        >
          <span
            className={`icon ${isChecked ? 'opacity-100' : 'opacity-0'} text-white transition-opacity duration-200`}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.0791 3.08687C12.307 3.31468 12.307 3.68402 12.0791 3.91183L5.66248 10.3285C5.43467 10.5563 5.06533 10.5563 4.83752 10.3285L1.92085 7.41183C1.69305 7.18402 1.69305 6.81468 1.92085 6.58687C2.14866 6.35906 2.51801 6.35906 2.74581 6.58687L5.25 9.09106L11.2542 3.08687C11.482 2.85906 11.8513 2.85906 12.0791 3.08687Z"
              />
            </svg>
          </span>
        </span>
        {label && <span className="ml-2 text-sm">{label}</span>}
      </label>
    </div>
  );
};
