import * as target from './ToEligibilityOrganisation';
import { EligibilityOrganisation } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { buildTestServiceLayerOrganisation } from '@/root/src/member-eligibility/shared/types/testing/BuildTestServiceLayerOrganisation';

it('should map basic organisation details when employment status is undefined', () => {
  const result = target.toEligibilityOrganisation(
    buildTestServiceLayerOrganisation({
      organisationId: '1',
      name: 'name',
      employedIdRequirements: undefined,
      volunteerIdRequirements: undefined,
      retiredIdRequirements: undefined,
    }),
    undefined
  );

  expect(result).toEqual(<EligibilityOrganisation>{
    id: '1',
    label: 'name',
    idRequirements: [],
    employedIdRequirements: undefined,
    volunteerIdRequirements: undefined,
    retiredIdRequirements: undefined,
  });
});

it('should map employed ID requirements', () => {
  const organisation = buildTestServiceLayerOrganisation({
    organisationId: '1',
    name: 'name',
  });

  const result = target.toEligibilityOrganisation(organisation, 'Employed');

  expect(result).toEqual(<EligibilityOrganisation>{
    id: '1',
    label: 'name',
    idRequirements: [
      {
        title: 'Work Email',
        description: '',
        guidelines: 'Must be work email',
        type: 'email',
        required: true,
      },
    ],
  });
});

it('should map retired ID requirements', () => {
  const organisation = buildTestServiceLayerOrganisation({
    organisationId: '1',
    name: 'name',
  });

  const result = target.toEligibilityOrganisation(organisation, 'Retired or Bereaved');

  expect(result).toEqual(<EligibilityOrganisation>{
    id: '1',
    label: 'name',
    idRequirements: [
      {
        title: 'ID Card',
        description: '',
        guidelines: 'Upload ID card',
        type: 'file upload',
        required: true,
      },
    ],
  });
});

it('should map volunteer ID requirements', () => {
  const organisation = buildTestServiceLayerOrganisation({
    organisationId: '1',
    name: 'name',
  });

  const result = target.toEligibilityOrganisation(organisation, 'Volunteer');

  expect(result).toEqual(<EligibilityOrganisation>{
    id: '1',
    label: 'name',
    idRequirements: [
      {
        title: 'Volunteer Card',
        description: '',
        guidelines: 'Upload volunteer card',
        type: 'file upload',
        required: false,
      },
    ],
  });
});
