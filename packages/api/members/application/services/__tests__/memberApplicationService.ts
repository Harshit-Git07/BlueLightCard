import { Logger } from '@aws-lambda-powertools/logger';
import { MemberApplicationRepository } from '../../repositories/memberApplicationRepository';
import { MemberApplicationService } from '../memberApplicationService';
import { z } from 'zod';
import {
  MemberApplicationUpdatePayload,
  MemberApplicationQueryPayload,
} from '../../types/memberApplicationTypes';
import { MemberApplicationModel } from '../../models/memberApplicationModel';
import { NewCardReason } from '../../enums/NewCardReason';

// Mock the dependencies
jest.mock('../../repositories/memberApplicationRepository');
jest.mock('@aws-lambda-powertools/logger');

describe('MemberApplicationService', () => {
  let service: MemberApplicationService;
  let mockRepository: jest.MockedObject<MemberApplicationRepository>;
  let mockLogger: jest.MockedObject<Logger>;

  let queryPayload: MemberApplicationQueryPayload = {
    brand: 'blc-uk',
    memberUUID: '1234',
    applicationId: '5678',
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
      addr1: '123 Test Street',
      addr2: 'Apt 4B',
      city: 'Testville',
      postcode: '12345',
      country: 'Testland',
      start_time: '2024-12-12T00:00:00Z',
      eligibility_status: 'Eligible',
      verification_method: 'Email',
      id_s3_primary: 's3://bucket/primary-id.jpg',
      id_s3_secondary: 's3://bucket/secondary-id.jpg',
      trusted_domain_email: 'test@example.com',
      new_card_reason: NewCardReason.LOST_CARD,
      change_reason: 'Address change',
      change_firstname: 'John',
      change_surname: 'Doe',
      change_doc_type: 'Passport',
      rejection_reason: 'Incomplete application',
    };

    await service.upsertMemberApplication(queryPayload, updatePayload, false);

    expect(mockRepository.upsertMemberApplication).toHaveBeenCalledWith(
      queryPayload,
      updatePayload,
      false,
    );
    expect(mockLogger.info).toHaveBeenCalledWith('Application updated successfully', {
      query: queryPayload,
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
      eligibility_status: 'Eligible',
      verification_method: 'Email',
      id_s3_primary: 's3://bucket/primary-id.jpg',
      id_s3_secondary: 's3://bucket/secondary-id.jpg',
      trusted_domain_email: 'test@example.com',
      new_card_reason: NewCardReason.LOST_CARD,
      change_reason: 'Address change',
      change_firstname: 'John',
      change_surname: 'Doe',
      change_doc_type: 'Passport',
      rejection_reason: 'Incomplete application',
    };

    await expect(
      service.upsertMemberApplication(queryPayload, invalidPayload as any, false),
    ).rejects.toThrow(z.ZodError);
    expect(mockRepository.upsertMemberApplication).not.toHaveBeenCalled();
    expect(mockLogger.error).toHaveBeenCalled();
  });

  it('should return a not found message if ConditionalCheckFailedException occurs', async () => {
    const updatePayload: MemberApplicationUpdatePayload = {
      addr1: '123 Test Street',
      addr2: 'Apt 4B',
      city: 'Testville',
      postcode: '12345',
      country: 'Testland',
      start_time: '2024-12-12T00:00:00Z',
      eligibility_status: 'Eligible',
      verification_method: 'Email',
      id_s3_primary: 's3://bucket/primary-id.jpg',
      id_s3_secondary: 's3://bucket/secondary-id.jpg',
      trusted_domain_email: 'test@example.com',
      new_card_reason: NewCardReason.LOST_CARD,
      change_reason: 'Address change',
      change_firstname: 'John',
      change_surname: 'Doe',
      change_doc_type: 'Passport',
      rejection_reason: 'Incomplete application',
    };

    const error = new Error('ConditionalCheckFailedException');
    (error as any).code = 'ConditionalCheckFailedException';
    mockRepository.upsertMemberApplication.mockRejectedValue(error);

    try {
      await service.upsertMemberApplication(queryPayload, updatePayload, false);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect((err as any).code).toBe('ConditionalCheckFailedException');
    }
  });

  it('should retrieve member applications successfully', async () => {
    const mockApplications: MemberApplicationModel[] = [
      {
        member_uuid: '12345678-1234-1234-12345678',
        application_uuid: '56785678-1234-1234-56785678',
        addr1: '123 Test Street',
        addr2: 'Apt 4B',
        city: 'Testville',
        postcode: '12345',
        country: 'Testland',
        start_time: '2024-12-12T00:00:00Z',
        eligibility_status: 'Eligible',
        verification_method: 'Email',
        id_s3_primary: 's3://bucket/primary-id.jpg',
        id_s3_secondary: 's3://bucket/secondary-id.jpg',
        trusted_domain_email: 'test@example.com',
        new_card_reason: NewCardReason.LOST_CARD,
        change_reason: 'Address change',
        change_firstname: 'John',
        change_surname: 'Doe',
        change_doc_type: 'Passport',
        rejection_reason: 'Incomplete application',
      },
    ];
    mockRepository.getMemberApplications.mockResolvedValue(mockApplications);

    const result = await service.getMemberApplications(queryPayload);

    expect(result).toEqual(mockApplications);
    expect(mockRepository.getMemberApplications).toHaveBeenCalledWith(queryPayload);
  });

  it('should handle no member applications found', async () => {
    mockRepository.getMemberApplications.mockResolvedValue([]);

    const result = await service.getMemberApplications(queryPayload);

    expect(result).toEqual([]);
    expect(mockRepository.getMemberApplications).toHaveBeenCalledWith(queryPayload);
  });

  it('should return multiple applications for a single member without specifying an application ID', async () => {
    const mockApplications: MemberApplicationModel[] = [
      {
        member_uuid: '12345678-1234-1234-12345678',
        application_uuid: '56785678-1234-1234-56785678',
        addr1: '123 Test Street',
        addr2: 'Apt 4B',
        city: 'Testville',
        postcode: '12345',
        country: 'Testland',
        start_time: '2024-12-12T00:00:00Z',
        eligibility_status: 'Eligible',
        verification_method: 'Email',
        id_s3_primary: 's3://bucket/primary-id.jpg',
        id_s3_secondary: 's3://bucket/secondary-id.jpg',
        trusted_domain_email: 'test@example.com',
        new_card_reason: NewCardReason.NAME_CHANGE,
        change_reason: 'Address change',
        change_firstname: 'John',
        change_surname: 'Doe',
        change_doc_type: 'Passport',
        rejection_reason: 'Incomplete application',
      },
      {
        member_uuid: '12345678-1234-1234-12345678',
        application_uuid: '56785678-1234-1234-56785678',
        addr1: '124 Test Street',
        addr2: 'Apt 4B',
        city: 'Testville',
        postcode: '12345',
        country: 'Testland',
        start_time: '2024-12-12T00:00:00Z',
        eligibility_status: 'Eligible',
        verification_method: 'Email',
        id_s3_primary: 's3://bucket/primary-id.jpg',
        id_s3_secondary: 's3://bucket/secondary-id.jpg',
        trusted_domain_email: 'test@example.com',
        new_card_reason: NewCardReason.LOST_CARD,
        change_reason: 'Address change',
        change_firstname: 'John',
        change_surname: 'Doe',
        change_doc_type: 'Passport',
        rejection_reason: 'Incomplete application',
      },
    ];

    mockRepository.getMemberApplications.mockResolvedValue(mockApplications);

    const result = await service.getMemberApplications(queryPayload);

    expect(result).toEqual(mockApplications);
    expect(mockRepository.getMemberApplications).toHaveBeenCalledWith(queryPayload);
  });

  it('should log an error if repository throws an unexpected error during update', async () => {
    const updatePayload: MemberApplicationUpdatePayload = {
      addr1: '123 Test Street',
      addr2: 'Apt 4B',
      city: 'Testville',
      postcode: '12345',
      country: 'Testland',
      start_time: '2024-12-12T00:00:00Z',
      eligibility_status: 'Eligible',
      verification_method: 'Email',
      id_s3_primary: 's3://bucket/primary-id.jpg',
      id_s3_secondary: 's3://bucket/secondary-id.jpg',
      trusted_domain_email: 'test@example.com',
      new_card_reason: NewCardReason.LOST_CARD,
      change_reason: 'Address change',
      change_firstname: 'John',
      change_surname: 'Doe',
      change_doc_type: 'Passport',
      rejection_reason: 'Incomplete application',
    };

    const unexpectedError = new Error('Unexpected error');
    mockRepository.upsertMemberApplication.mockRejectedValue(unexpectedError);

    try {
      await service.upsertMemberApplication(queryPayload, updatePayload, false);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect((err as Error).message).toBe('Unexpected error');
    }
  });

  it('should log an info message when an application is successfully created', async () => {
    const createPayload: MemberApplicationUpdatePayload = {
      addr1: '123 Test Street',
      addr2: 'Apt 4B',
      city: 'Testville',
      postcode: '12345',
      country: 'Testland',
      start_time: '2024-12-12T00:00:00Z',
      eligibility_status: 'Eligible',
      verification_method: 'Email',
      id_s3_primary: 's3://bucket/primary-id.jpg',
      id_s3_secondary: 's3://bucket/secondary-id.jpg',
      trusted_domain_email: 'test@example.com',
      new_card_reason: NewCardReason.SIGNUP,
      change_reason: null,
      change_firstname: null,
      change_surname: null,
      change_doc_type: null,
      rejection_reason: null,
    };

    await service.upsertMemberApplication(queryPayload, createPayload, true);

    expect(mockRepository.upsertMemberApplication).toHaveBeenCalledWith(
      queryPayload,
      createPayload,
      true,
    );
    expect(mockLogger.info).toHaveBeenCalledWith('Application created successfully', {
      query: queryPayload,
    });
  });
});
