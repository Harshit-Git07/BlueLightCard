import { format, subYears } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

import { OrganisationService } from '@blc-mono/members/application/services/organisationService';
import { ProfileService } from '@blc-mono/members/application/services/profileService';
import { ProfileModel } from '@blc-mono/shared/models/members/profileModel';

import { getProfileDetails } from './getProfileDetails';

jest.mock('sst/node/table', () => {
  return {
    Table: {
      memberProfiles: jest.fn(),
      memberOrganisations: jest.fn(),
      memberAdmin: jest.fn(),
    },
    Bucket: {
      documentUploadBucket: jest.fn(),
    },
  };
});

jest.mock('@blc-mono/members/application/services/organisationService');
jest.mock('@blc-mono/members/application/services/profileService');

describe('getUserDetails', () => {
  const memberId = uuidv4();
  const organisationId = uuidv4();
  const employerId = uuidv4();

  const mockOrganisation = {
    organisationId,
    name: 'Test Organisation',
    active: true,
    employedIdRequirements: { minimumRequired: 1, supportedDocuments: [] },
    retiredIdRequirements: { minimumRequired: 1, supportedDocuments: [] },
    volunteerIdRequirements: { minimumRequired: 1, supportedDocuments: [] },
    trustedDomains: [],
  };

  const mockProfile = {
    memberId,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    dateOfBirth: '2024-01-01',
    organisationId,
    employerId,
    applications: [],
  };

  beforeEach(() => {
    jest.spyOn(ProfileService.prototype, 'getProfile').mockResolvedValue(mockProfile);
    jest.spyOn(OrganisationService.prototype, 'getOrganisation').mockResolvedValue(mockOrganisation);
  });

  it('should return user details with dob', async () => {
    const result = await getProfileDetails('1234');

    expect(result).toEqual({ dob: mockProfile.dateOfBirth, organisation: mockOrganisation.name });
  });

  it('should return user details with underage dob if undefined', async () => {
    jest
      .spyOn(ProfileService.prototype, 'getProfile')
      .mockResolvedValue({ ...mockProfile, dateOfBirth: undefined } as unknown as ProfileModel);

    const result = await getProfileDetails('1234');
    const underageDob = format(subYears(new Date(), 17), 'yyyy-MM-dd');
    expect(result).toEqual({ dob: underageDob, organisation: mockOrganisation.name });
  });

  it('should return undefined if no profile', async () => {
    jest.spyOn(ProfileService.prototype, 'getProfile').mockResolvedValue(undefined as unknown as ProfileModel);

    const result = await getProfileDetails('1234');

    expect(result).toBeUndefined();
  });

  it('should return undefined if no organisation on profile', async () => {
    jest.spyOn(ProfileService.prototype, 'getProfile').mockResolvedValue({ ...mockProfile, organisationId: undefined });

    const result = await getProfileDetails('1234');

    expect(result).toStrictEqual({ dob: mockProfile.dateOfBirth, organisation: undefined });
  });
});
