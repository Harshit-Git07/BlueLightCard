import { ActionDropdownItem } from './types';

export const memberDropdownItems: ActionDropdownItem[] = [
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
