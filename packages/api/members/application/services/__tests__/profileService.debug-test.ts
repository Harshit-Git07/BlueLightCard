/**
 * This is a debug test. It will not run as part of the test suite and is instead just used to test code against a real environment
 */

import { defaultDynamoDbClient } from '@blc-mono/members/application/repositories/dynamoClient';
import { ProfileRepository } from '@blc-mono/members/application/repositories/profileRepository';
import { ProfileService } from '@blc-mono/members/application/services/profileService';
import { EmploymentStatus } from '@blc-mono/members/application/models/enums/EmploymentStatus';

const repository = new ProfileRepository(
  defaultDynamoDbClient,
  'pr-3501-blc-mono-blc-mono-memberProfiles',
);

const profileService = new ProfileService(repository);

it('should create a profile', async () => {
  const profileId = await profileService.createProfile({
    firstName: 'Neil',
    lastName: 'Armstrong',
    email: 'neil.armstrong@instil.co',
    dateOfBirth: '1970-01-01',
    employmentStatus: EmploymentStatus.EMPLOYED,
  });

  expect(profileId).toEqual(expect.any(String));
  console.log({ profileId });
});
