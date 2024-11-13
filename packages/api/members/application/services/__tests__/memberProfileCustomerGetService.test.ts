import { MemberProfileCustomerGetService } from '../memberProfileCustomerGetService';
import { MemberProfileCustomerGetRepository } from '../../repositories/memberProfileCustomerGetRepository';
import { LambdaLogger as Logger } from '../../../../core/src/utils/logger/lambdaLogger';
import { APIError } from '../../models/APIError';
import { CustomerProfileModel } from '../../models/customer/customerProfileModel';
import { GetCustomerProfileQueryPayload } from '../../types/customerProfileTypes';
import { APIErrorCode } from '../../enums/APIErrorCode';

jest.mock('../../repositories/memberProfileCustomerGetRepository');
jest.mock('../../../../core/src/utils/logger/lambdaLogger');

describe('MemberProfileCustomerGetService', () => {
  let service: MemberProfileCustomerGetService;
  let mockRepository: jest.Mocked<MemberProfileCustomerGetRepository>;
  let mockLogger: jest.Mocked<Logger>;

  const mockCustomerProfile: CustomerProfileModel = {
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: new Date('1990-01-01'),
    gender: 'male',
    phoneNumber: '1234567890',
    emailAddress: 'john.doe@example.com',
    county: 'County',
    employmentType: 'full-time',
    organisationId: 'ORG123',
    employerName: 'employer name',
    employerId: 'EMP456',
    jobTitle: 'Engineer',
    reference: 'REF123',
    card: {
      cardNumber: '1234-5678-9012-3456',
      cardCreated: null,
      cardExpiry: new Date(1726097583),
      cardStatus: 'status',
      cardPaymentStatus: 'status',
    },
    applications: [],
  };

  beforeEach(() => {
    mockRepository = new MemberProfileCustomerGetRepository(
      null as any,
      '',
    ) as jest.Mocked<MemberProfileCustomerGetRepository>;
    mockLogger = new Logger({
      serviceName: 'memberProfileCustomerGetService',
    }) as jest.Mocked<Logger>;
    service = new MemberProfileCustomerGetService(mockRepository, mockLogger);

    jest.clearAllMocks();
  });

  it('should return customer profile successfully', async () => {
    mockRepository.getCustomerProfile.mockResolvedValue(mockCustomerProfile);

    const payload: GetCustomerProfileQueryPayload = {
      brand: 'BLC_UK',
      memberUuid: '12345',
      profileUuid: '56789',
    };

    const result = await service.getCustomerProfile(payload);

    expect(mockRepository.getCustomerProfile).toHaveBeenCalledWith(payload);
    expect(result.customerProfile).toEqual(mockCustomerProfile);
    expect(result.errorSet).toEqual([]);
  });

  it('should handle APIError correctly', async () => {
    const error = new Error('Member profile not found');

    const expectedApiError = new APIError(
      APIErrorCode.RESOURCE_NOT_FOUND,
      'getCustomerProfile',
      'Member profile not found',
    );

    mockRepository.getCustomerProfile.mockRejectedValue(error);

    const payload: GetCustomerProfileQueryPayload = {
      brand: 'BLC_UK',
      memberUuid: '12345',
      profileUuid: '56789',
    };

    const result = await service.getCustomerProfile(payload);

    expect(mockRepository.getCustomerProfile).toHaveBeenCalledWith(payload);
    expect(result.customerProfile).toEqual({});
    expect(result.errorSet).toEqual([expectedApiError]);
  });

  it('should handle generic error and log it', async () => {
    const genericError = new Error('Something went wrong');

    mockRepository.getCustomerProfile.mockRejectedValue(genericError);

    const payload: GetCustomerProfileQueryPayload = {
      brand: 'BLC_UK',
      memberUuid: '12345',
      profileUuid: '56789',
    };

    const result = await service.getCustomerProfile(payload);

    expect(mockRepository.getCustomerProfile).toHaveBeenCalledWith(payload);
    expect(result.customerProfile).toEqual({});

    expect(result.errorSet[0]).toBeInstanceOf(APIError);
    expect(result.errorSet[0].code).toBe(APIErrorCode.GENERIC_ERROR);
    expect(result.errorSet[0].detail).toBe(genericError.message);

    expect(mockLogger.error).toHaveBeenCalledWith({
      message: `Error getting customer profile for 12345`,
      error: genericError.message,
    });
  });
});
