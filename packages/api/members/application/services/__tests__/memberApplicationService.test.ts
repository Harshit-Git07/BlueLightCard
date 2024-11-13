import { LambdaLogger as Logger } from '../../../../core/src/utils/logger/lambdaLogger';
import { MemberApplicationRepository } from '../../repositories/memberApplicationRepository';
import { MemberApplicationService } from '../memberApplicationService';
import { z } from 'zod';
import {
  MemberApplicationUpdatePayload,
  MemberApplicationQueryPayload,
} from '../../types/memberApplicationTypes';
import { MemberApplicationModel } from '../../models/memberApplicationModel';
import { ApplicationReason } from '../../enums/ApplicationReason';
import { APIError } from '@blc-mono/members/application/models/APIError';
import { RejectionReason } from '../../enums/RejectionReason';

// Mock the dependencies
jest.mock('../../repositories/memberApplicationRepository');
jest.mock('../../../../core/src/utils/logger/lambdaLogger');

describe('MemberApplicationService', () => {
  let service: MemberApplicationService;
  let mockRepository: jest.MockedObject<MemberApplicationRepository>;
  let mockLogger: jest.MockedObject<Logger>;

  let queryPayload: MemberApplicationQueryPayload = {
    brand: 'blc-uk',
    memberUUID: '12345687-2134-1234-1234-123456781234',
    applicationId: '22345687-2134-1234-1234-123456781234',
  };

  beforeEach(() => {
    mockRepository = {
      getMemberApplications: jest.fn(),
      upsertMemberApplication: jest.fn(),
    } as unknown as jest.MockedObject<MemberApplicationRepository>;

    mockLogger = {
      warn: jest.fn(),
      info: jest.fn(),
      error: jest.fn(),
    } as unknown as jest.MockedObject<Logger>;

    service = new MemberApplicationService(mockRepository, mockLogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update a member application successfully', async () => {
    const updatePayload: MemberApplicationUpdatePayload = {
      address1: '123 Test Street',
      address2: 'Apt 4B',
      city: 'Testville',
      postcode: '12345',
      country: 'Testland',
      startDate: '2024-12-12T00:00:00Z',
      eligibilityStatus: 'Eligible',
      verificationMethod: 'Email',
      idS3LocationPrimary: 's3://bucket/primary-id.jpg',
      idS3LocationSecondary: 's3://bucket/secondary-id.jpg',
      trustedDomainEmail: 'test@example.com',
      applicationReason: ApplicationReason.LOST_CARD,
      nameChangeReason: 'Address change',
      nameChangeFirstName: 'John',
      nameChangeLastName: 'Doe',
      nameChangeDocType: 'Passport',
      rejectionReason: RejectionReason.DECLINE_INCORRECT_ID,
      promoCode: null,
      trustedDomainValidated: false,
    };

    let errorSet: APIError[] = [];

    await service.upsertMemberApplication(queryPayload, updatePayload, false, errorSet);

    expect(mockRepository.upsertMemberApplication).toHaveBeenCalledWith(
      queryPayload,
      updatePayload,
      false,
    );
    expect(mockLogger.info).toHaveBeenCalledWith({
      message: 'Application updated successfully',
      body: queryPayload,
    });
  });

  it('should throw a validation error if data is invalid', async () => {
    const invalidPayload = {
      addr1: '123 Test Street',
      addr2: 'Apt 4B',
      city: 'Testville',
      postcode: '12345',
      country: 'Testland',
      start_time: 'INVALID_DATE',
      id_s3_primary: 's3://bucket/primary-id.jpg',
      id_s3_secondary: 's3://bucket/secondary-id.jpg',
      trusted_domain_email: 'test@example.com',
      new_card_reason: ApplicationReason.LOST_CARD,
      change_reason: 'Address change',
      change_firstname: 'John',
      change_surname: 'Doe',
      change_doc_type: 'Passport',
      rejection_reason: 'Incomplete application',
    };

    let errorSet: APIError[] = [];

    await service.upsertMemberApplication(queryPayload, invalidPayload as any, true, errorSet);

    expect(errorSet).toHaveLength(2);

    expect(mockRepository.upsertMemberApplication).not.toHaveBeenCalled();
  });

  it('should return a not found message if ConditionalCheckFailedException occurs', async () => {
    const updatePayload: MemberApplicationUpdatePayload = {
      address1: '123 Test Street',
      address2: 'Apt 4B',
      city: 'Testville',
      postcode: '12345',
      country: 'Testland',
      startDate: '2024-12-12T00:00:00Z',
      eligibilityStatus: 'Eligible',
      verificationMethod: 'Email',
      idS3LocationPrimary: 's3://bucket/primary-id.jpg',
      idS3LocationSecondary: 's3://bucket/secondary-id.jpg',
      trustedDomainEmail: 'test@example.com',
      applicationReason: ApplicationReason.LOST_CARD,
      nameChangeReason: 'Address change',
      nameChangeFirstName: 'John',
      nameChangeLastName: 'Doe',
      nameChangeDocType: 'Passport',
      rejectionReason: 'Incomplete application',
      promoCode: null,
      trustedDomainValidated: false,
    };

    const error = new Error('ConditionalCheckFailedException');
    (error as any).code = 'ConditionalCheckFailedException';
    mockRepository.upsertMemberApplication.mockRejectedValue(error);

    let errorSet: APIError[] = [];

    try {
      await service.upsertMemberApplication(queryPayload, updatePayload, false, errorSet);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect((err as any).code).toBe('ConditionalCheckFailedException');
    }
  });

  it('should retrieve member applications successfully', async () => {
    const mockApplications: MemberApplicationModel[] = [
      {
        memberUuid: '12345678-1234-1234-12345678',
        applicationUuid: '56785678-1234-1234-56785678',
        address1: '123 Test Street',
        address2: 'Apt 4B',
        city: 'Testville',
        postcode: '12345',
        country: 'Testland',
        startDate: '2024-12-12T00:00:00Z',
        eligibilityStatus: 'Eligible',
        verificationMethod: 'Email',
        idS3LocationPrimary: 's3://bucket/primary-id.jpg',
        idS3LocationSecondary: 's3://bucket/secondary-id.jpg',
        trustedDomainEmail: 'test@example.com',
        applicationReason: ApplicationReason.LOST_CARD,
        nameChangeReason: 'Address change',
        nameChangeFirstName: 'John',
        nameChangeLastName: 'Doe',
        nameChangeDocType: 'Passport',
        rejectionReason: RejectionReason.DECLINE_INCORRECT_ID,
        promoCode: null,
        trustedDomainValidated: false,
      },
    ];
    mockRepository.getMemberApplications.mockResolvedValue(mockApplications);

    let errorSet: APIError[] = [];

    const result = await service.getMemberApplications(queryPayload, errorSet);

    expect(result).toEqual(mockApplications);
    expect(mockRepository.getMemberApplications).toHaveBeenCalledWith(queryPayload);
  });

  it('should handle no member applications found', async () => {
    mockRepository.getMemberApplications.mockResolvedValue([]);

    let errorSet: APIError[] = [];
    const result = await service.getMemberApplications(queryPayload, errorSet);

    expect(result).toEqual([]);
    expect(mockRepository.getMemberApplications).toHaveBeenCalledWith(queryPayload);
  });

  it('should return multiple applications for a single member without specifying an application ID', async () => {
    const mockApplications: MemberApplicationModel[] = [
      {
        memberUuid: '12345678-1234-1234-12345678',
        applicationUuid: '56785678-1234-1234-56785678',
        address1: '123 Test Street',
        address2: 'Apt 4B',
        city: 'Testville',
        postcode: '12345',
        country: 'Testland',
        startDate: '2024-12-12T00:00:00Z',
        eligibilityStatus: 'Eligible',
        verificationMethod: 'Email',
        idS3LocationPrimary: 's3://bucket/primary-id.jpg',
        idS3LocationSecondary: 's3://bucket/secondary-id.jpg',
        trustedDomainEmail: 'test@example.com',
        applicationReason: ApplicationReason.NAME_CHANGE,
        nameChangeReason: 'Address change',
        nameChangeFirstName: 'John',
        nameChangeLastName: 'Doe',
        nameChangeDocType: 'Passport',
        rejectionReason: RejectionReason.DECLINE_INCORRECT_ID,
        promoCode: null,
        trustedDomainValidated: false,
      },
      {
        memberUuid: '12345678-1234-1234-12345678',
        applicationUuid: '56785678-1234-1234-56785678',
        address1: '124 Test Street',
        address2: 'Apt 4B',
        city: 'Testville',
        postcode: '12345',
        country: 'Testland',
        startDate: '2024-12-12T00:00:00Z',
        eligibilityStatus: 'Eligible',
        verificationMethod: 'Email',
        idS3LocationPrimary: 's3://bucket/primary-id.jpg',
        idS3LocationSecondary: 's3://bucket/secondary-id.jpg',
        trustedDomainEmail: 'test@example.com',
        applicationReason: ApplicationReason.LOST_CARD,
        nameChangeReason: 'Address change',
        nameChangeFirstName: 'John',
        nameChangeLastName: 'Doe',
        nameChangeDocType: 'Passport',
        rejectionReason: RejectionReason.DECLINE_INCORRECT_ID,
        promoCode: null,
        trustedDomainValidated: false,
      },
    ];

    mockRepository.getMemberApplications.mockResolvedValue(mockApplications);

    let errorSet: APIError[] = [];
    const result = await service.getMemberApplications(queryPayload, errorSet);

    expect(result).toEqual(mockApplications);
    expect(mockRepository.getMemberApplications).toHaveBeenCalledWith(queryPayload);
  });

  it('should log an error if repository throws an unexpected error during update', async () => {
    const updatePayload: MemberApplicationUpdatePayload = {
      address1: '123 Test Street',
      address2: 'Apt 4B',
      city: 'Testville',
      postcode: '12345',
      country: 'Testland',
      startDate: '2024-12-12T00:00:00Z',
      eligibilityStatus: 'Eligible',
      verificationMethod: 'Email',
      idS3LocationPrimary: 's3://bucket/primary-id.jpg',
      idS3LocationSecondary: 's3://bucket/secondary-id.jpg',
      trustedDomainEmail: 'test@example.com',
      applicationReason: ApplicationReason.LOST_CARD,
      nameChangeReason: 'Address change',
      nameChangeFirstName: 'John',
      nameChangeLastName: 'Doe',
      nameChangeDocType: 'Passport',
      rejectionReason: 'Incomplete application',
      promoCode: null,
      trustedDomainValidated: false,
    };

    const unexpectedError = new Error('Unexpected error');

    mockRepository.upsertMemberApplication.mockRejectedValue(unexpectedError);

    let errorSet: APIError[] = [];
    try {
      await service.upsertMemberApplication(queryPayload, updatePayload, false, errorSet);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect((err as Error).message).toBe('Unexpected error');
    }
  });

  it('should log an info message when an application is successfully created', async () => {
    const createPayload: MemberApplicationUpdatePayload = {
      address1: '123 Test Street',
      address2: 'Apt 4B',
      city: 'Testville',
      postcode: '12345',
      country: 'Testland',
      startDate: '2024-12-12T00:00:00Z',
      eligibilityStatus: 'Eligible',
      verificationMethod: 'Email',
      idS3LocationPrimary: 's3://bucket/primary-id.jpg',
      idS3LocationSecondary: 's3://bucket/secondary-id.jpg',
      trustedDomainEmail: 'test@example.com',
      applicationReason: ApplicationReason.SIGNUP,
      nameChangeReason: null,
      nameChangeFirstName: null,
      nameChangeLastName: null,
      nameChangeDocType: null,
      rejectionReason: null,
      promoCode: null,
      trustedDomainValidated: false,
    };

    let errorSet: APIError[] = [];
    await service.upsertMemberApplication(queryPayload, createPayload, true, errorSet);

    expect(mockRepository.upsertMemberApplication).toHaveBeenCalledWith(
      queryPayload,
      createPayload,
      true,
    );
    expect(mockLogger.info).toHaveBeenCalledWith({
      message: 'Application created successfully',
      body: queryPayload,
    });
  });
});
