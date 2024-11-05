import React from 'react';

export interface TableData {
  id: string;
  checked?: boolean;

  [key: string]: any;
}

export interface TableHeader {
  name: string;
  key: string;
  styles?: string;
  showBadge?: boolean;
}

export interface TableProps<T extends TableData = TableData> {
  headers: TableHeader[];
  data: T[];
  renderCell?: (header: TableHeader, row: T) => React.ReactNode;
  showCheckbox?: boolean;
  highlightCheckedRows?: boolean;
  showActions?: boolean;
  onRowSelect?: (selectedRow: string) => void;
  onAction?: (action: string, rowKey: string) => void;
  checkboxPosition?: number;
  checkboxHeader?: TableHeader;
  dropdownItems?: ActionDropdownItem[];
  customiseDropdownItems?: (
    items: ActionDropdownItem[],
    rowData: TableData,
  ) => ActionDropdownItem[];
}

export interface TableHeadProps {
  headers: TableHeader[];
  showCheckbox: boolean;
  showActions: boolean;
  checkboxPosition: number;
}

export interface TableBodyProps<T extends TableData = TableData> {
  headers: TableHeader[];
  data: T[];
  renderCell?: (header: TableHeader, row: T) => React.ReactNode;
  showCheckbox: boolean;
  highlightCheckedRows?: boolean;
  showActions: boolean;
  onRowSelect: (id: string) => void;
  onAction: (action: string, rowId: string) => void;
  checkboxPosition: number;
  dropdownItems: ActionDropdownItem[];
  customizeDropdownItems?: (
    items: ActionDropdownItem[],
    rowData: TableData,
  ) => ActionDropdownItem[];
}

export interface TableCheckboxProps {
  id: string;
  isChecked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
}

export interface TableDropdownProps {
  items: TableDropdownItem[];
  rowData: TableData;
}

interface TableDropdownItem {
  label: string;
  onClick: () => void;
  condition?: (rowData: TableData) => boolean;
}

export interface ActionDropdownItem {
  label: string;
  action: string;
  condition?: (rowData: TableData) => boolean;
}
