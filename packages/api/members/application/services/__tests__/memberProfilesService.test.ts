import { Logger } from '@aws-lambda-powertools/logger';
import { MemberProfilesRepository } from '../../repositories/memberProfilesRepository';
import { MemberProfilesService } from '../memberProfilesService';
import {
  ProfileUpdatePayload,
  AddressInsertPayload,
  CreateProfilePayload,
} from '../../types/memberProfilesTypes';
import { MemberProfileApp, MemberProfileDB } from '../../models/memberProfileModel';
import { transformDBToApp } from '../../models/memberProfileModel';

// Mock the dependencies
jest.mock('../../repositories/memberProfilesRepository');
jest.mock('@aws-lambda-powertools/logger');
jest.mock('../../models/memberProfileModel', () => ({
  ...jest.requireActual('../../models/memberProfileModel'),
  transformDBToApp: jest.fn(),
}));

describe('MemberProfileService', () => {
  let service: MemberProfilesService;
  let mockRepository: jest.MockedObject<MemberProfilesRepository>;
  let mockLogger: jest.MockedObject<Logger>;

  beforeEach(() => {
    mockRepository = {
      createCustomerProfiles: jest.fn(),
      getMemberProfiles: jest.fn(),
      getProfileSortKey: jest.fn(),
      updateProfile: jest.fn(),
      insertAddressAndUpdateProfile: jest.fn(),
      insertCard: jest.fn(),
    } as unknown as jest.MockedObject<MemberProfilesRepository>;

    mockLogger = {
      warn: jest.fn(),
      info: jest.fn(),
      error: jest.fn(),
    } as unknown as jest.MockedObject<Logger>;

    service = new MemberProfilesService(mockRepository, mockLogger);
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

    it('should create a member profile successfully and return memberUuid', async () => {
      mockRepository.createCustomerProfiles.mockResolvedValue(memberUuid);

      const result = await service.createCustomerProfiles(payload, brand);

      expect(mockRepository.createCustomerProfiles).toHaveBeenCalledWith(payload, brand);
      expect(mockLogger.info).toHaveBeenCalledWith('Profile created successfully', {
        memberUuid,
      });
      expect(result).toBe(memberUuid); // Check that the correct memberUuid is returned
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

  describe('getMemberProfiles', () => {
    const uuid = '123456';

    it('should return a transformed member profile when found', async () => {
      const mockDBProfile: Partial<MemberProfileDB> = {
        pk: 'MEMBER#123456',
        sk: 'PROFILE#123456',
      };
      const mockAppProfile: Partial<MemberProfileApp> = {
        uuid: '123456',
      };

      mockRepository.getMemberProfiles.mockResolvedValue(mockDBProfile as MemberProfileDB);
      (transformDBToApp as jest.Mock).mockReturnValue(mockAppProfile);

      const result = await service.getMemberProfiles(uuid);

      expect(mockRepository.getMemberProfiles).toHaveBeenCalledWith(uuid);
      expect(transformDBToApp).toHaveBeenCalledWith(mockDBProfile);
      expect(result).toBeTruthy();
      expect(result?.uuid).toBe(uuid);
    });

    it('should return null when profile is not found', async () => {
      mockRepository.getMemberProfiles.mockResolvedValue(null);

      const result = await service.getMemberProfiles(uuid);

      expect(mockRepository.getMemberProfiles).toHaveBeenCalledWith(uuid);
      expect(result).toBeNull();
    });

    it('should throw an error when repository throws an error', async () => {
      const error = new Error('Database error');
      mockRepository.getMemberProfiles.mockRejectedValue(error);

      await expect(service.getMemberProfiles(uuid)).rejects.toThrow(
        'Error processing member profile',
      );

      expect(mockLogger.error).toHaveBeenCalledWith('Error processing member profile', {
        error,
        uuid,
      });
    });

    describe('updateProfile', () => {
      const memberUUID = '456';
      const payload: ProfileUpdatePayload = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        mobile: '1234567890',
        gender: 'male',
      };

      it('should update the profile successfully', async () => {
        mockRepository.getProfileSortKey.mockResolvedValue('PROFILE#123');
        mockRepository.updateProfile.mockResolvedValue(undefined);

        await service.updateProfile(memberUUID, payload);

        expect(mockRepository.getProfileSortKey).toHaveBeenCalledWith(`MEMBER#${memberUUID}`);
        expect(mockRepository.updateProfile).toHaveBeenCalledWith(
          `MEMBER#${memberUUID}`,
          'PROFILE#123',
          payload,
        );

        expect(mockLogger.info).toHaveBeenCalledWith('Profile updated successfully', {
          memberUUID,
        });
      });

      it('should throw an error when profile is not found', async () => {
        mockRepository.getProfileSortKey.mockResolvedValue(null);

        await expect(service.updateProfile(memberUUID, payload)).rejects.toThrow(
          'Member profile not found',
        );

        expect(mockLogger.warn).toHaveBeenCalledWith('Member profile not found: ', { memberUUID });
      });

      it('should throw an error when updateProfile fails', async () => {
        mockRepository.getProfileSortKey.mockResolvedValue('PROFILE#123');
        mockRepository.updateProfile.mockRejectedValue(new Error('Update failed'));

        await expect(service.updateProfile(memberUUID, payload)).rejects.toThrow('Update failed');

        expect(mockLogger.error).toHaveBeenCalledWith('Error updating profile:', {
          error: 'Update failed',
        });
      });

      it('should handle unknown errors', async () => {
        mockRepository.getProfileSortKey.mockRejectedValue('Unknown error');

        await expect(service.updateProfile(memberUUID, payload)).rejects.toThrow(
          'Unknown error occurred while updating profile',
        );

        expect(mockLogger.error).toHaveBeenCalledWith('Unknown error updating profile:', {
          error: 'Unknown error',
        });
      });
    });

    describe('insertAddress', () => {
      const memberUUID = '789';
      const payload: AddressInsertPayload = {
        addressLine1: '123 test st',
        addressLine2: 'Address line 2 test',
        townCity: 'Testtown',
        county: 'Testville',
        postcode: '12345',
      };

      it('should insert address successfully', async () => {
        mockRepository.getProfileSortKey.mockResolvedValue('PROFILE#456');
        mockRepository.insertAddressAndUpdateProfile.mockResolvedValue(undefined);

        await service.insertAddress(memberUUID, payload);

        expect(mockRepository.getProfileSortKey).toHaveBeenCalledWith(`MEMBER#${memberUUID}`);
        expect(mockRepository.insertAddressAndUpdateProfile).toHaveBeenCalledWith(
          `MEMBER#${memberUUID}`,
          'PROFILE#456',
          payload,
        );

        expect(mockLogger.info).toHaveBeenCalledWith(
          'Address inserted and profile updated with county successfully',
          { memberUUID },
        );
      });

      it('should throw an error when profile is not found', async () => {
        mockRepository.getProfileSortKey.mockResolvedValue(null);

        await expect(service.insertAddress(memberUUID, payload)).rejects.toThrow(
          'Member profile not found',
        );

        expect(mockLogger.warn).toHaveBeenCalledWith('Member profile not found: ', { memberUUID });
      });

      it('should throw an error when insertAddressAndUpdateProfile fails', async () => {
        mockRepository.getProfileSortKey.mockResolvedValue('PROFILE#456');
        const insertError = new Error('Insert failed');
        mockRepository.insertAddressAndUpdateProfile.mockRejectedValue(insertError);

        await expect(service.insertAddress(memberUUID, payload)).rejects.toThrow('Insert failed');

        expect(mockLogger.error).toHaveBeenCalledWith('Error inserting address:', {
          error: 'Insert failed',
        });
      });
    });
  });
});
