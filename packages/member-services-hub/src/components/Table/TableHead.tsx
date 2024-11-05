import React from 'react';
import { TableHeadProps } from './types';

export const TableHead: React.FC<TableHeadProps> = ({
  headers,
  showCheckbox,
  showActions,
  checkboxPosition,
}) => {
  return (
    <thead>
      <tr className="bg-blue-600 text-left">
        {headers.map((header, index) => (
          <th
            className={`py-4 px-4 text-base font-medium text-white ${header.styles} ${
              index === 0 ? 'first:pl-11' : ''
            } min-w-[180px] whitespace-nowrap`}
            key={header.key}
          >
            {header.name}
          </th>
        ))}
        {showActions && (
          <th className="min-w-[100px] py-4 px-4 last:pr-11 text-base font-medium text-white text-right">
            Actions
          </th>
        )}
      </tr>
    </thead>
  );
};
