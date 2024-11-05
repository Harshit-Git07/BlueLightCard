import React from 'react';
import { TableBodyProps, TableData } from './types';
import { TableCheckbox } from './TableCheckbox';
import { TableDropdown } from './TableDropdown';
import Badge from '../Badge/Badge';
import { ColourVariant } from '@/app/common/types/theme';

const badgeTypeMap: Record<ColourVariant, Set<string>> = {
  [ColourVariant.Success]: new Set(['confirmed', 'approved', 'active', 'posted & paid']),
  [ColourVariant.Warning]: new Set([
    'unvalidated, pending refund, awaiting printing',
    'awaiting payment',
  ]),
  [ColourVariant.Danger]: new Set([
    'awaiting id approval',
    'awaiting approval',
    'awaiting id',
    'suspended',
    'expired',
    'lost',
  ]),
  [ColourVariant.Info]: new Set([]),
  [ColourVariant.Default]: new Set([]),
};

const getBadgeType = (value: string): ColourVariant => {
  const lowerValue = value.toLowerCase();

  for (const [badgeType, values] of Object.entries(badgeTypeMap)) {
    if (values.has(lowerValue)) {
      return badgeType as ColourVariant;
    }
  }

  return ColourVariant.Default;
};

export const TableBody = <T extends TableData>({
  headers,
  data,
  showCheckbox,
  highlightCheckedRows,
  showActions,
  onRowSelect,
  onAction,
  checkboxPosition,
  dropdownItems,
  customizeDropdownItems,
  renderCell,
}: TableBodyProps<T>) => {
  return (
    <tbody>
      {data.map((row) => {
        const rowId = row.id;
        const finalDropdownItems = customizeDropdownItems
          ? customizeDropdownItems(dropdownItems, row)
          : dropdownItems;

        const dropdownItemsWithOnClick = finalDropdownItems.map((item) => ({
          ...item,
          onClick: () => onAction(item.action, rowId),
        }));

        return (
          <tr
            key={rowId}
            className={`border-b border-stroke dark:border-dark-3 hover:bg-primary/5 ${
              highlightCheckedRows && row.checked && showCheckbox
                ? 'bg-blue-100 dark:bg-blue-900/20'
                : ''
            }`}
          >
            {headers.map((header, index) => {
              if (header.key === 'checkbox') {
                return (
                  <td
                    key={`${rowId}-checkbox`}
                    className={`py-5 ${
                      index === 0 ? 'pl-11' : 'px-4'
                    } min-w-[180px] whitespace-nowrap`}
                  >
                    <TableCheckbox
                      id={rowId}
                      isChecked={row.checked || false}
                      onChange={() => onRowSelect(rowId)}
                    />
                  </td>
                );
              }
              return (
                <td
                  key={`${rowId}-${header.key}`}
                  className={`py-5 ${
                    index === 0 ? 'pl-11' : 'px-4'
                  } min-w-[180px] whitespace-nowrap`}
                >
                  {renderCell ? (
                    renderCell(header, row)
                  ) : header.showBadge ? (
                    <Badge
                      type={getBadgeType(row[header.key] as string)}
                      text={row[header.key] as string}
                    />
                  ) : (
                    <p className="text-base text-body-color dark:text-black">{row[header.key]}</p>
                  )}
                </td>
              );
            })}
            {showActions && (
              <td className="py-5 px-4 text-center">
                <div className="flex justify-center">
                  <TableDropdown items={dropdownItemsWithOnClick} rowData={row} />
                </div>
              </td>
            )}
          </tr>
        );
      })}
    </tbody>
  );
};
