/**
 * This is a debug test. It will not run as part of the test suite and is instead just used to test code against a real environment
 */

import { ProfileRepository } from '@blc-mono/members/application/repositories/profileRepository';
import { ProfileService } from '@blc-mono/members/application/services/profileService';
import { EmploymentStatus } from '@blc-mono/shared/models/members/enums/EmploymentStatus';
import { ProfileModel } from '@blc-mono/shared/models/members/profileModel';
import { OrganisationService } from '@blc-mono/members/application/services/organisation/organisationService';
import { OrganisationRepository } from '@blc-mono/members/application/repositories/organisationRepository';

jest.mock('@blc-mono/members/application/providers/Tables', () => ({
  memberOrganisationsTableName: () => 'pr-3629-blc-mono-blc-mono-memberOrganisations',
  memberProfilesTableName: () => 'pr-3629-blc-mono-blc-mono-memberProfiles',
}));

const organisationRepository = new OrganisationRepository();
const profileRepository = new ProfileRepository();

const organisationService = new OrganisationService(organisationRepository);
const profileService = new ProfileService(profileRepository, organisationService);

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

it('should update a profile', async () => {
  const id = '19921f4f-9d17-11ef-b68d-506b8d536548';

  await profileService.updateProfile(id, {
    firstName: 'Neil',
    lastName: 'Armstrong',
    dateOfBirth: '1970-01-01',
    employmentStatus: EmploymentStatus.EMPLOYED,
    organisationId: 'bc2e948e-1804-4440-9dcc-f329557bc1f0',
    employerId: '147b0cec-5086-432b-b938-478eaf568284',
    jobTitle: 'asdfas',
  });

  const profile = await profileService.getProfile(id);
  expect(profile).toEqual(<ProfileModel>{
    applications: [
      {
        address1: 'stub address 1',
        applicationId: '19921f4f-9d17-11ef-b68d-506b8d536548',
        applicationReason: 'SIGNUP',
        city: 'stub city',
        documents: [],
        eligibilityStatus: 'INELIGIBLE',
        memberId: '19921f4f-9d17-11ef-b68d-506b8d536548',
        startDate: '2024-12-18T15:14:18.485Z',
      },
    ],
    cards: [],
    county: 'Down',
    dateOfBirth: '1970-01-01',
    email: 'neil.armstrong@instil.co',
    employerId: '147b0cec-5086-432b-b938-478eaf568284',
    employmentStatus: 'EMPLOYED',
    firstName: 'Neil',
    jobTitle: 'asdfas',
    lastName: 'Armstrong',
    memberId: '19921f4f-9d17-11ef-b68d-506b8d536548',
    organisationId: 'bc2e948e-1804-4440-9dcc-f329557bc1f0',
  });
});
