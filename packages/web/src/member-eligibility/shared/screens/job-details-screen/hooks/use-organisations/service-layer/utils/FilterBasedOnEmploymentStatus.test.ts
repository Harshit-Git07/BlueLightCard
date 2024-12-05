import * as target from './FilterBasedOnEmploymentStatus';
import { buildTestServiceLayerOrganisation } from '@/root/src/member-eligibility/shared/types/testing/BuildTestServiceLayerOrganisation';

const serviceLayerOrganisations = [
  buildTestServiceLayerOrganisation({
    organisationId: 'employed',
    name: 'employed',
    employmentStatus: ['EMPLOYED'],
  }),
  buildTestServiceLayerOrganisation({
    organisationId: 'retired',
    name: 'retired',
    employmentStatus: ['RETIRED'],
  }),
  buildTestServiceLayerOrganisation({
    organisationId: 'volunteer',
    name: 'volunteer',
    employmentStatus: ['VOLUNTEER'],
  }),
];

it('should only return employers for the employed status', () => {
  const result = target.filterBasedOnEmploymentStatus(serviceLayerOrganisations, 'Employed');

  expect(result).toEqual([
    buildTestServiceLayerOrganisation({
      organisationId: 'employed',
      name: 'employed',
      employmentStatus: ['EMPLOYED'],
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
      employmentStatus: ['RETIRED'],
    }),
  ]);
});

it('should only return employers for the volunteer status', () => {
  const result = target.filterBasedOnEmploymentStatus(serviceLayerOrganisations, 'Volunteer');

  expect(result).toEqual([
    buildTestServiceLayerOrganisation({
      organisationId: 'volunteer',
      name: 'volunteer',
      employmentStatus: ['VOLUNTEER'],
    }),
  ]);
});

it('should only return all employers if employment status is undefined', () => {
  const result = target.filterBasedOnEmploymentStatus(serviceLayerOrganisations, undefined);

  expect(result).toEqual(serviceLayerOrganisations);
});
