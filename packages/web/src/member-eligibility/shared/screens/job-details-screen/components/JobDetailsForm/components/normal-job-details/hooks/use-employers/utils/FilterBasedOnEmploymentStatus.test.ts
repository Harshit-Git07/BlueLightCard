import * as target from './FilterBasedOnEmploymentStatus';
import { buildTestServiceLayerEmployer } from '@/root/src/member-eligibility/shared/types/testing/BuildTestServiceLayerEmployer';
import { EmploymentStatus } from '@blc-mono/shared/models/members/enums/EmploymentStatus';

const serviceLayerEmployers = [
  buildTestServiceLayerEmployer({
    employerId: 'employed',
    name: 'employed',
    employmentStatus: [EmploymentStatus.EMPLOYED],
  }),
  buildTestServiceLayerEmployer({
    employerId: 'retired',
    name: 'retired',
    employmentStatus: [EmploymentStatus.RETIRED],
  }),
  buildTestServiceLayerEmployer({
    employerId: 'volunteer',
    name: 'volunteer',
    employmentStatus: [EmploymentStatus.VOLUNTEER],
  }),
];

it('should only return employers for the employed status', () => {
  const result = target.filterBasedOnEmploymentStatus(serviceLayerEmployers, 'Employed');

  expect(result).toEqual([
    buildTestServiceLayerEmployer({
      employerId: 'employed',
      name: 'employed',
      employmentStatus: [EmploymentStatus.EMPLOYED],
    }),
  ]);
});

it('should only return employers for the retired status', () => {
  const result = target.filterBasedOnEmploymentStatus(serviceLayerEmployers, 'Retired or Bereaved');

  expect(result).toEqual([
    buildTestServiceLayerEmployer({
      employerId: 'retired',
      name: 'retired',
      employmentStatus: [EmploymentStatus.RETIRED],
    }),
  ]);
});

it('should only return employers for the volunteer status', () => {
  const result = target.filterBasedOnEmploymentStatus(serviceLayerEmployers, 'Volunteer');

  expect(result).toEqual([
    buildTestServiceLayerEmployer({
      employerId: 'volunteer',
      name: 'volunteer',
      employmentStatus: [EmploymentStatus.VOLUNTEER],
    }),
  ]);
});

it('should only return all employers if employment status is undefined', () => {
  const result = target.filterBasedOnEmploymentStatus(serviceLayerEmployers, undefined);

  expect(result).toEqual(serviceLayerEmployers);
});
