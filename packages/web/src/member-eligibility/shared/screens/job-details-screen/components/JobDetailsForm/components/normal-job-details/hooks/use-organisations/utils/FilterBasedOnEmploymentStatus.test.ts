import * as target from './FilterBasedOnEmploymentStatus';
import { buildTestServiceLayerOrganisation } from '@/root/src/member-eligibility/shared/types/testing/BuildTestServiceLayerOrganisation';
import { EmploymentStatus } from '@blc-mono/shared/models/members/enums/EmploymentStatus';

const serviceLayerOrganisations = [
  buildTestServiceLayerOrganisation({
    organisationId: 'employed',
    name: 'employed',
    employmentStatus: [EmploymentStatus.EMPLOYED],
  }),
  buildTestServiceLayerOrganisation({
    organisationId: 'retired',
    name: 'retired',
    employmentStatus: [EmploymentStatus.RETIRED],
  }),
  buildTestServiceLayerOrganisation({
    organisationId: 'volunteer',
    name: 'volunteer',
    employmentStatus: [EmploymentStatus.VOLUNTEER],
  }),
];

it('should only return employers for the employed status', () => {
  const result = target.filterBasedOnEmploymentStatus(serviceLayerOrganisations, 'Employed');

  expect(result).toEqual([
    buildTestServiceLayerOrganisation({
      organisationId: 'employed',
      name: 'employed',
      employmentStatus: [EmploymentStatus.EMPLOYED],
    }),
  ]);
});

it('should only return employers for the retired status', () => {
  const result = target.filterBasedOnEmploymentStatus(
    serviceLayerOrganisations,
    'Retired or Bereaved'
  );

  expect(result).toEqual([
    buildTestServiceLayerOrganisation({
      organisationId: 'retired',
      name: 'retired',
      employmentStatus: [EmploymentStatus.RETIRED],
    }),
  ]);
});

it('should only return employers for the volunteer status', () => {
  const result = target.filterBasedOnEmploymentStatus(serviceLayerOrganisations, 'Volunteer');

  expect(result).toEqual([
    buildTestServiceLayerOrganisation({
      organisationId: 'volunteer',
      name: 'volunteer',
      employmentStatus: [EmploymentStatus.VOLUNTEER],
    }),
  ]);
});

it('should only return all employers if employment status is undefined', () => {
  const result = target.filterBasedOnEmploymentStatus(serviceLayerOrganisations, undefined);

  expect(result).toEqual(serviceLayerOrganisations);
});
