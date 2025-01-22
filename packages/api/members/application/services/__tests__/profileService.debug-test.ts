/**
 * This is a debug test. It will not run as part of the test suite and is instead just used to test code against a real environment
 */

import { defaultDynamoDbClient } from '@blc-mono/members/application/repositories/dynamoClient';
import { ProfileRepository } from '@blc-mono/members/application/repositories/profileRepository';
import { ProfileService } from '@blc-mono/members/application/services/profileService';
import { EmploymentStatus } from '@blc-mono/shared/models/members/enums/EmploymentStatus';

const repository = new ProfileRepository(defaultDynamoDbClient, 'staging-blc-mono-memberProfiles');

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

it('should delete a profile', async () => {
  const id = '83339a45-48ee-467c-ada9-2482f194d971';

  await profileService.deleteProfile(id);

  await expect(profileService.getProfile(id)).rejects.toThrow(
    new Error('Member profile not found'),
  );
});
