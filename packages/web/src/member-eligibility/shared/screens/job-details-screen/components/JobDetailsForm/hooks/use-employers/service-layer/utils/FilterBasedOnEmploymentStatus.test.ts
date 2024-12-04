import * as target from './FilterBasedOnEmploymentStatus';
import { ServiceLayerEmployer } from '@/root/src/member-eligibility/shared/types/ServiceLayerEmployer';

const serviceLayerEmployers: ServiceLayerEmployer[] = [
  {
    employerId: 'employed',
    name: 'employed',
    active: true,
  },
  {
    employerId: 'retired',
    name: 'retired',
    retired: true,
  },
  {
    employerId: 'volunteer',
    name: 'volunteer',
    volunteers: true,
  },
];

it('should only return employers for the employed status', () => {
  const result = target.filterBasedOnEmploymentStatus(serviceLayerEmployers, 'Employed');

  expect(result).toEqual(<ServiceLayerEmployer[]>[
    {
      employerId: 'employed',
      name: 'employed',
      active: true,
    },
  ]);
});

it('should only return employers for the retired status', () => {
  const result = target.filterBasedOnEmploymentStatus(serviceLayerEmployers, 'Retired or Bereaved');

  expect(result).toEqual(<ServiceLayerEmployer[]>[
    {
      employerId: 'retired',
      name: 'retired',
      retired: true,
    },
  ]);
});

it('should only return employers for the volunteer status', () => {
  const result = target.filterBasedOnEmploymentStatus(serviceLayerEmployers, 'Volunteer');

  expect(result).toEqual(<ServiceLayerEmployer[]>[
    {
      employerId: 'volunteer',
      name: 'volunteer',
      volunteers: true,
    },
  ]);
});

it('should only return all employers if employment status is undefined', () => {
  const result = target.filterBasedOnEmploymentStatus(serviceLayerEmployers, undefined);

  expect(result).toEqual(serviceLayerEmployers);
});
