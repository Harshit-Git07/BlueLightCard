import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Table from '../../Table/Table';
import { TableBody } from '../../Table/TableBody';
import { TableHead } from '../../Table/TableHead';
import { TableCheckbox } from '../../Table/TableCheckbox';
import { TableDropdown } from '../../Table/TableDropdown';
import { ActionDropdownItem, TableData } from '../../Table/types';

// Mock data
const headers = [
  {
    name: 'ID',
    key: 'id',
  },
  {
    name: 'Name',
    key: 'name',
  },
  {
    name: 'Email',
    key: 'email',
  },
  {
    name: 'User Status',
    key: 'userStatus',
    showBadge: true,
  },
  {
    name: 'Eligibility',
    key: 'eligibility',
    showBadge: true,
  },
  {
    name: 'Service',
    key: 'service',
  },
  {
    name: 'Trust',
    key: 'trust',
  },
  {
    name: 'Reg Date',
    key: 'regDate',
  },
];

const data: TableData[] = [
  {
    id: '123456',
    name: 'John Doe',
    email: 'john.doe@example.com',
    userStatus: 'Confirmed',
    eligibility: 'Approved',
    service: 'Ambulance Service',
    trust: 'City Hospital Trust',
    regDate: '2023-01-15',
  },
  {
    id: '789012',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    userStatus: 'Awaiting approval',
    eligibility: 'Awaiting ID approval',
    service: 'Emergency Response',
    trust: 'County Health Services',
    regDate: '2023-03-22',
  },
];

const mockDropdownItems: ActionDropdownItem[] = [
  {
    label: 'Edit',
    action: 'edit',
  },
  {
    label: 'Delete',
    action: 'delete',
    condition: (rowData) => rowData.userStatus !== 'Suspended',
  },
  {
    label: 'Promote',
    action: 'promote',
    condition: (rowData) => rowData.eligibility === 'Approved',
  },
];

describe('Table Component', () => {
  it('should render Table component', () => {
    render(<Table headers={headers} data={data} dropdownItems={mockDropdownItems} />);
    expect(screen.getByRole('table')).toBeTruthy();
  });

  it('should render correct number of rows', () => {
    render(<Table headers={headers} data={data} dropdownItems={mockDropdownItems} />);
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(data.length + 1); // +1 for header row
  });
});

describe('TableBody Component', () => {
  it('should render TableBody component', () => {
    render(
      <table>
        <TableBody
          headers={headers}
          data={data}
          showCheckbox={true}
          showActions={true}
          onRowSelect={() => {}}
          onAction={() => {}}
          dropdownItems={mockDropdownItems}
          checkboxPosition={0}
        />
      </table>
    );
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(data.length);
  });
});

describe('TableHead Component', () => {
  it('should render TableHead component', () => {
    render(
      <table>
        <TableHead headers={headers} showCheckbox={true} showActions={true} checkboxPosition={0} />
      </table>
    );
    expect(screen.getByRole('row')).toBeTruthy();
  });
});

describe('TableCheckbox Component', () => {
  it('should render TableCheckbox component', () => {
    render(<TableCheckbox id="1" isChecked={false} onChange={() => {}} />);
    expect(screen.getByRole('checkbox')).toBeTruthy();
  });

  it('should call onChange when clicked', () => {
    const mockOnChange = jest.fn();
    render(<TableCheckbox id="1" isChecked={false} onChange={mockOnChange} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(mockOnChange).toHaveBeenCalled();
  });
});

describe('TableDropdown Component', () => {
  const mockRowData: TableData = {
    id: '123',
    userStatus: 'Active',
    eligibility: 'Approved',
  };

  const mockOnAction = jest.fn();

  const dropdownItemsWithOnClick = mockDropdownItems.map((item) => ({
    ...item,
    onClick: () => mockOnAction(item.action, mockRowData.id),
  }));

  it('should render TableDropdown component', () => {
    render(<TableDropdown items={dropdownItemsWithOnClick} rowData={mockRowData} />);
    expect(screen.getByRole('button')).toBeTruthy();
  });

  it('should open dropdown when clicked', () => {
    render(<TableDropdown items={dropdownItemsWithOnClick} rowData={mockRowData} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('menu')).toBeTruthy();
  });

  it('should render correct number of dropdown items based on conditions', () => {
    render(<TableDropdown items={dropdownItemsWithOnClick} rowData={mockRowData} />);
    fireEvent.click(screen.getByRole('button'));
    const dropdownItems = screen.getAllByRole('menuitem');
    expect(dropdownItems.length).toBe(3);
  });

  it('should not render "Delete" option for suspended users', () => {
    const suspendedUserData = {
      ...mockRowData,
      userStatus: 'Suspended',
    };
    const suspendedDropdownItems = dropdownItemsWithOnClick.filter((item) =>
      item.condition ? item.condition(suspendedUserData) : true
    );
    render(<TableDropdown items={suspendedDropdownItems} rowData={suspendedUserData} />);
    fireEvent.click(screen.getByRole('button'));
    const dropdownItems = screen.getAllByRole('menuitem');
    expect(dropdownItems.length).toBe(2); // "Delete" should not be visible
    expect(screen.queryByText('Delete')).toBeNull();
  });

  it('should call onClick when a dropdown item is clicked', () => {
    render(<TableDropdown items={dropdownItemsWithOnClick} rowData={mockRowData} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Edit'));
    expect(mockOnAction).toHaveBeenCalledWith('edit', '123');
  });
});
