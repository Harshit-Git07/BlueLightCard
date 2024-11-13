import { LambdaLogger as Logger } from '../../../../core/src/utils/logger/lambdaLogger';
import { memberProfileCustomerCreateRepository } from '../../repositories/memberProfileCustomerCreateRepository';
import { memberProfileCustomerCreateService } from '../memberProfileCustomerCreateService';
import { CreateProfilePayload } from '../../types/memberProfilesTypes';

// Mock the dependencies
jest.mock('../../repositories/memberProfileCustomerCreateRepository');
jest.mock('../../../../core/src/utils/logger/lambdaLogger');
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
    const payload: CreateProfilePayload = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      emailAddress: 'test@mail.com',
    };
    const memberUuid = 'uuid-1234';

    it('should create a member profile successfully and return memberUuid', async () => {
      mockRepository.createCustomerProfiles.mockResolvedValue(memberUuid);

      const result = await service.createCustomerProfiles(payload);

      expect(mockRepository.createCustomerProfiles).toHaveBeenCalledWith(payload);
      expect(mockLogger.info).toHaveBeenCalledWith({
        message: 'Profile created successfully: memberUuid: uuid-1234',
      });
      expect(result).toStrictEqual(memberUuid);
    });

    it('should log and throw an error if profile creation fails', async () => {
      const error = new Error('Database error');
      mockRepository.createCustomerProfiles.mockRejectedValue(error);

      await expect(service.createCustomerProfiles(payload)).rejects.toThrow('Database error');

      expect(mockRepository.createCustomerProfiles).toHaveBeenCalledWith(payload);
      expect(mockLogger.error).toHaveBeenCalledWith({
        error: 'Database error',
        message: 'Error creating profile:',
      });
    });

    it('should log and throw an unknown error if the error is not an instance of Error', async () => {
      const unknownError = 'Something went wrong';
      mockRepository.createCustomerProfiles.mockRejectedValue(unknownError);

      await expect(service.createCustomerProfiles(payload)).rejects.toThrow(
        'Unknown error occurred while creating profile',
      );

      expect(mockLogger.error).toHaveBeenCalledWith({
        message: 'Unknown error creating profile:',
        error: JSON.stringify(unknownError),
      });
    });
  });
});
