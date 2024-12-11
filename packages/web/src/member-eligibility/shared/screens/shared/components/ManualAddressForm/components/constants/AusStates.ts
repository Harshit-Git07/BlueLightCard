import { DropdownOptions } from '@bluelightcard/shared-ui/components/Dropdown/types';

export const australianStates = [
  'New South Wales',
  'Victoria',
  'Queensland',
  'Western Australia',
  'South Australia',
  'Tasmania',
  'Northern Territory',
  'Australian Capital Territory',
];

export const australianStatesDropdownOptions: DropdownOptions = australianStates.map((state) => ({
  id: state,
  label: state,
}));
