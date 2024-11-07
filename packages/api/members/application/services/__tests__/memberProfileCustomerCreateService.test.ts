import { Logger } from '@aws-lambda-powertools/logger';
import { memberProfileCustomerCreateRepository } from '../../repositories/memberProfileCustomerCreateRepository';
import { memberProfileCustomerCreateService } from '../memberProfileCustomerCreateService';
import { AddressInsertPayload, CreateProfilePayload } from '../../types/memberProfilesTypes';
import { MemberProfileApp, MemberProfileDB } from '../../models/memberProfilesModel';
import { transformDBToApp } from '../../models/memberProfilesModel';

// Mock the dependencies
jest.mock('../../repositories/memberProfileCustomerCreateRepository');
jest.mock('@aws-lambda-powertools/logger');
jest.mock('../../models/memberProfilesModel', () => ({
  ...jest.requireActual('../../models/memberProfilesModel'),
  transformDBToApp: jest.fn(),
}));

describe('MemberProfileService', () => {
  let service: memberProfileCustomerCreateService;
  let mockRepository: jest.MockedObject<memberProfileCustomerCreateRepository>;
  let mockLogger: jest.MockedObject<Logger>;

  beforeEach(() => {
    mockRepository = {
      createCustomerProfiles: jest.fn(),
      getMemberProfiles: jest.fn(),
      getProfileSortKey: jest.fn(),
      updateProfile: jest.fn(),
      insertAddressAndUpdateProfile: jest.fn(),
      insertCard: jest.fn(),
    } as unknown as jest.MockedObject<memberProfileCustomerCreateRepository>;

    mockLogger = {
      warn: jest.fn(),
      info: jest.fn(),
      error: jest.fn(),
    } as unknown as jest.MockedObject<Logger>;

    service = new memberProfileCustomerCreateService(mockRepository, mockLogger);
  });

  describe('createCustomerProfiles', () => {
    const brand = 'BLC_UK';
    const payload: CreateProfilePayload = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      emailAddress: 'test@mail.com',
    };
    const memberUuid = 'uuid-1234';
    const profileUuid = 'uuid-5678';

    it('should create a member profile successfully and return memberUuid', async () => {
      mockRepository.createCustomerProfiles.mockResolvedValue([memberUuid, profileUuid]);

      const result = await service.createCustomerProfiles(payload, brand);

      expect(mockRepository.createCustomerProfiles).toHaveBeenCalledWith(payload, brand);
      expect(mockLogger.info).toHaveBeenCalledWith('Profile created successfully', {
        memberUuid,
        profileUuid,
      });
      expect(result).toStrictEqual([memberUuid, profileUuid]); // Check that the correct memberUuid is returned
    });

    it('should log and throw an error if profile creation fails', async () => {
      const error = new Error('Database error');
      mockRepository.createCustomerProfiles.mockRejectedValue(error);

      await expect(service.createCustomerProfiles(payload, brand)).rejects.toThrow(
        'Database error',
      );

      expect(mockRepository.createCustomerProfiles).toHaveBeenCalledWith(payload, brand);
      expect(mockLogger.error).toHaveBeenCalledWith('Error creating profile:', {
        error: 'Database error',
      });
    });

    it('should log and throw an unknown error if the error is not an instance of Error', async () => {
      const unknownError = 'Something went wrong';
      mockRepository.createCustomerProfiles.mockRejectedValue(unknownError);

      await expect(service.createCustomerProfiles(payload, brand)).rejects.toThrow(
        'Unknown error occurred while creating profile',
      );

      expect(mockLogger.error).toHaveBeenCalledWith('Unknown error creating profile:', {
        error: unknownError,
      });
    });
  });
});
