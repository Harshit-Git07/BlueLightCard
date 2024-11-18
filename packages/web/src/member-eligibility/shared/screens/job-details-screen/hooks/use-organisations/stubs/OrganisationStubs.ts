import { EligibilityOrganisation } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/EligibilityDetails';

// TODO: Remove this later, but for fuzzy frontend purposes it allows us to test multi-id easily on mobile
export const organisationNoEmployersStub: EligibilityOrganisation = {
  id: 'no-employers-stub',
  label: 'No employers stub',
};
export const organisationPromocodeStub: EligibilityOrganisation = {
  id: 'promocode-stub',
  label: 'Promocode stub',
};
export const organisationMultiIdStub: EligibilityOrganisation = {
  id: 'multi-id-stub',
  label: 'Multi-ID stub',
};

export const fuzzyFrontendActionStubs: EligibilityOrganisation[] = [
  organisationNoEmployersStub,
  organisationPromocodeStub,
  organisationMultiIdStub,
];

// TODO: When the service calls are all hooked up this can be removed
export const organisationsStub: EligibilityOrganisation[] = [
  { id: '1', label: 'Police' },
  { id: '2', label: 'NHS' },
  { id: '3', label: 'Blood Bikes' },
  { id: '4', label: 'Ambulance' },
  { id: '5', label: 'Dentist' },
  ...fuzzyFrontendActionStubs,
];
