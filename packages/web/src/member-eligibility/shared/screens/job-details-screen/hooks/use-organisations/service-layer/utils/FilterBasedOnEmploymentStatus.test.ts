import * as target from './FilterBasedOnEmploymentStatus';
import { ServiceLayerOrganisation } from '@/root/src/member-eligibility/shared/types/ServiceLayerOrganisation';

const serviceLayerOrganisations: ServiceLayerOrganisation[] = [
  {
    organisationId: 'employed',
    name: 'employed',
    active: true,
  },
  {
    organisationId: 'retired',
    name: 'retired',
    retired: true,
  },
  {
    organisationId: 'volunteer',
    name: 'volunteer',
    volunteers: true,
  },
];

it('should only return employers for the employed status', () => {
  const result = target.filterBasedOnEmploymentStatus(serviceLayerOrganisations, 'Employed');

  expect(result).toEqual(<ServiceLayerOrganisation[]>[
    {
      organisationId: 'employed',
      name: 'employed',
      active: true,
    },
  ]);
});

it('should only return employers for the retired status', () => {
  const result = target.filterBasedOnEmploymentStatus(
    serviceLayerOrganisations,
    'Retired or Bereaved'
  );

  expect(result).toEqual(<ServiceLayerOrganisation[]>[
    {
      organisationId: 'retired',
      name: 'retired',
      retired: true,
    },
  ]);
});

it('should only return employers for the volunteer status', () => {
  const result = target.filterBasedOnEmploymentStatus(serviceLayerOrganisations, 'Volunteer');

  expect(result).toEqual(<ServiceLayerOrganisation[]>[
    {
      organisationId: 'volunteer',
      name: 'volunteer',
      volunteers: true,
    },
  ]);
});

it('should only return all employers if employment status is undefined', () => {
  const result = target.filterBasedOnEmploymentStatus(serviceLayerOrganisations, undefined);

  expect(result).toEqual(serviceLayerOrganisations);
});
