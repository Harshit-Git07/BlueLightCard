import React, { useEffect, useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Table from './Table';
import { ActionDropdownItem, TableData, TableHeader, TableProps } from './types';

const componentMeta: Meta<typeof Table> = {
  title: 'member-services-hub/Table Component',
  component: Table,
};

const Template: StoryFn<typeof Table> = (args) => {
  const [uniquePrefix] = useState(() => Math.random().toString(36).substring(7));

  const [data, setData] = useState(() =>
    args.data.map((row) => ({
      ...row,
      id: `${uniquePrefix}-${row.id}`,
    })),
  );

  useEffect(() => {
    setData(
      args.data.map((row) => ({
        ...row,
        id: `${uniquePrefix}-${row.id}`,
      })),
    );
  }, [args.data, uniquePrefix]);

  const handleRowSelect = (rowId: string) => {
    setData((prevData) =>
      prevData.map((row) =>
        row.id === rowId
          ? {
              ...row,
              checked: !row.checked,
            }
          : row,
      ),
    );
  };

  return <Table {...args} data={data} onRowSelect={handleRowSelect} />;
};

const sampleHeaders: TableHeader[] = [
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
];

const sampleData: TableData[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    userStatus: 'Confirmed',
    eligibility: 'Approved',
    service: 'Ambulance',
    checked: false,
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    userStatus: 'Awaiting approval',
    eligibility: 'Awaiting ID upload',
    service: 'Fire Department',
    checked: true,
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    userStatus: 'Suspended',
    eligibility: 'Not eligible',
    service: 'Police',
    checked: false,
  },
];

const defaultDropdownItems: ActionDropdownItem[] = [
  {
    label: 'Edit',
    action: 'edit',
  },
  {
    label: 'Suspend',
    action: 'suspend',
  },
  {
    label: 'Review ID',
    action: 'review_id',
    condition: (rowData) => rowData.userStatus === 'Awaiting approval',
  },
];

export const Default = Template.bind({});
Default.args = {
  headers: sampleHeaders,
  data: sampleData,
  showCheckbox: true,
  showActions: true,
  onAction: (action: string, rowKey: string) => console.log(`Action ${action} on row ${rowKey}`),
  dropdownItems: defaultDropdownItems,
  checkboxPosition: sampleHeaders.length,
  checkboxHeader: {
    key: 'checkbox',
    name: 'Select',
  },
} as TableProps;

export const WithoutCheckbox = Template.bind({});
WithoutCheckbox.args = {
  ...Default.args,
  showCheckbox: false,
} as TableProps;

export const WithoutActions = Template.bind({});
WithoutActions.args = {
  ...Default.args,
  showActions: false,
} as TableProps;

export const WithoutBadges = Template.bind({});
WithoutBadges.args = {
  ...Default.args,
  headers: sampleHeaders.map((header) => ({
    ...header,
    showBadge: false,
  })),
} as TableProps;

export const CustomBadgeColumns = Template.bind({});
CustomBadgeColumns.args = {
  ...Default.args,
  headers: [
    {
      name: 'ID',
      key: 'id',
    },
    {
      name: 'Name',
      key: 'name',
      showBadge: true,
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
    },
    {
      name: 'Service',
      key: 'service',
      showBadge: true,
    },
  ],
} as TableProps;

CustomBadgeColumns.parameters = {
  docs: {
    description: {
      story: `This example demonstrates custom badge column configuration.
      **Important Note:** For new badge types to display correctly, you must update the \`getBadgeType\` mapping in packages/member-services-hub/src/components/Table/TableBody.tsx. 
      The function should handle all the values that might appear in badged columns.`,
    },
  },
};

export const CustomDropdownItems = Template.bind({});
CustomDropdownItems.args = {
  ...Default.args,
  dropdownItems: [
    {
      label: 'View Details',
      action: 'view_details',
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
  ],
} as TableProps;

CustomDropdownItems.parameters = {
  docs: {
    description: {
      story:
        "This example shows custom dropdown items with conditional rendering. The 'Delete' option is available for non-suspended users, while 'Promote' is only shown for users with 'Approved' eligibility.",
    },
  },
};

export const DynamicDropdownItems = Template.bind({});
DynamicDropdownItems.args = {
  ...Default.args,
  customiseDropdownItems: (
    items: ActionDropdownItem[],
    rowData: TableData,
  ): ActionDropdownItem[] => {
    if (rowData.userStatus === 'Suspended') {
      return [
        {
          label: 'Reactivate',
          action: 'reactivate',
        },
        ...items,
      ];
    }
    return items;
  },
} as TableProps;

export const CheckboxAtStart = Template.bind({});
CheckboxAtStart.args = {
  ...Default.args,
  checkboxPosition: 0,
  checkboxHeader: {
    key: 'checkbox',
    name: 'Select',
  },
} as TableProps;

export const CheckboxInMiddle = Template.bind({});
CheckboxInMiddle.args = {
  ...Default.args,
  checkboxPosition: 3,
  checkboxHeader: {
    key: 'checkbox',
    name: 'Select',
  },
} as TableProps;

export const CheckboxAtEnd = Template.bind({});
CheckboxAtEnd.args = {
  ...Default.args,
  checkboxPosition: sampleHeaders.length,
  checkboxHeader: {
    key: 'checkbox',
    name: 'Select',
  },
} as TableProps;

export const HighlightCheckedRows = Template.bind({});
HighlightCheckedRows.args = {
  ...Default.args,
  highlightCheckedRows: true,
} as TableProps;

export const NoHighlightCheckedRows = Template.bind({});
NoHighlightCheckedRows.args = {
  ...Default.args,
  highlightCheckedRows: false,
} as TableProps;

export default componentMeta;
