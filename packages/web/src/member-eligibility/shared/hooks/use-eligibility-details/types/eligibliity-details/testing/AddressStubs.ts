import {
  AusAddress,
  UkAddress,
} from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

export const ukAddressStub: UkAddress = {
  line1: '123 Baker St',
  line2: 'Flat B',
  city: 'London',
  county: 'Down',
  postcode: 'NW1 6XE',
};

export const ausAddressStub: AusAddress = {
  line1: '123 George St',
  line2: 'Unit 4B',
  city: 'Sydney',
  state: 'NSW',
  postcode: '2000',
};
