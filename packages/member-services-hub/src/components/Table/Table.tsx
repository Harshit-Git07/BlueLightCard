import React from 'react';
import { TableHead } from './TableHead';
import { TableBody } from './TableBody';
import { TableProps, TableHeader, TableData } from './types';
import { memberDropdownItems } from './dropdownConfig';

const Table = <T extends TableData>({
  headers,
  data,
  showCheckbox = true,
  highlightCheckedRows = true,
  showActions = true,
  onRowSelect,
  onAction,
  checkboxPosition = -1,
  checkboxHeader,
  dropdownItems = memberDropdownItems,
  customiseDropdownItems,
  renderCell,
}: TableProps<T>) => {
  const handleRowSelect = (rowId: string) => {
    if (onRowSelect) {
      onRowSelect(rowId);
    }
  };

  const handleAction = (action: string, rowId: string) => {
    if (onAction) {
      onAction(action, rowId);
    }
  };

  const modifiedHeaders: TableHeader[] = [...headers];
  if (showCheckbox && checkboxHeader) {
    const checkboxHeaderObj: TableHeader = {
      ...checkboxHeader,
      styles: checkboxHeader.styles || 'w-[50px]',
    };

    const totalColumns = headers.length + (showActions ? 2 : 0);
    if (checkboxPosition < 0 || checkboxPosition >= totalColumns) {
      modifiedHeaders.unshift(checkboxHeaderObj);
    } else {
      modifiedHeaders.splice(checkboxPosition, 0, checkboxHeaderObj);
    }
  }

  return (
    <div className="max-w-full overflow-x-auto rounded-xl shadow-[0px_3px_8px_0px_rgba(0,0,0,0.08)] bg-white dark:bg-dark-2">
      <table className="w-full table-auto">
        <TableHead
          headers={modifiedHeaders}
          showCheckbox={showCheckbox}
          showActions={showActions}
          checkboxPosition={checkboxPosition}
        />
        <TableBody
          headers={modifiedHeaders}
          data={data}
          showCheckbox={showCheckbox}
          highlightCheckedRows={highlightCheckedRows}
          showActions={showActions}
          onRowSelect={handleRowSelect}
          onAction={handleAction}
          checkboxPosition={checkboxPosition}
          dropdownItems={dropdownItems}
          customizeDropdownItems={customiseDropdownItems}
          renderCell={renderCell}
        />
      </table>
    </div>
  );
};

export default Table;
