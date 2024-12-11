import { DropdownOptions } from '@bluelightcard/shared-ui/components/Dropdown/types';

const australiaStates = [
  'New South Wales',
  'Victoria',
  'Queensland',
  'Western Australia',
  'South Australia',
  'Tasmania',
  'Northern Territory',
  'Australian Capital Territory',
];

export const australianStatesDropdownOptions: DropdownOptions = australiaStates.map((state) => ({
  id: state,
  label: state,
}));
