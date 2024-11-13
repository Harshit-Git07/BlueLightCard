import { LambdaLogger as Logger } from '../../../../core/src/utils/logger/lambdaLogger';
import { MemberProfileCustomerRepository } from '../../repositories/memberProfileCustomerRepository';
import { OrganisationsRepository } from '../../repositories/organisationsRepository';
import { EmployersRepository } from '../../repositories/employersRepository';
import { MemberProfileCustomerService } from '../memberProfileCustomerService';
import {
  MemberProfileCustomerQueryPayload,
  MemberProfileCustomerUpdatePayload,
} from '../../types/memberProfileCustomerTypes';
import { MemberProfileCustomerModel } from '../../models/memberProfileCustomerModel';
import { APIError } from '../../models/APIError';
import { APIErrorCode } from '../../enums/APIErrorCode';
import { ZodError } from 'zod';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Gender } from '../../enums/Gender';

jest.mock('../../repositories/memberProfileCustomerRepository');
jest.mock('../../repositories/organisationsRepository');
jest.mock('../../repositories/employersRepository');
jest.mock('../../../../core/src/utils/logger/lambdaLogger');
jest.mock('../../models/memberProfileCustomerModel');

const mockDynamoDBDocClient = {} as DynamoDBDocumentClient;
const mockTableName = 'test-table';
const mockProfileRepository = new MemberProfileCustomerRepository(
  mockDynamoDBDocClient,
  mockTableName,
) as jest.Mocked<MemberProfileCustomerRepository>;
const mockOrganisationsRepository = new OrganisationsRepository(
  mockDynamoDBDocClient,
  mockTableName,
) as jest.Mocked<OrganisationsRepository>;
const mockEmployersRepository = new EmployersRepository(
  mockDynamoDBDocClient,
  mockTableName,
) as jest.Mocked<EmployersRepository>;
const mockLogger = new Logger({ serviceName: 'mockProfileCustomerService' }) as jest.Mocked<Logger>;

describe('MemberProfileCustomerService', () => {
  let service: MemberProfileCustomerService;
  const query: MemberProfileCustomerQueryPayload = {
    memberUUID: 'test-uuid',
    profileId: 'test-profile-id',
  };
  const payload: MemberProfileCustomerUpdatePayload = {
    dateOfBirth: '1960-01-01T00:00:00.000Z',
    phoneNumber: '123-456-7890',
    gender: Gender.MALE,
    county: 'Antrim',
    employmentType: 'Full-time',
    organisationId: '52745678-1234-1234-1234-123456781231',
    employerId: '99995678-1234-1264-1234-123456781234',
    jobTitle: 'Software Engineer',
    jobReference: 'REF123',
  };

  const mockOrganisation = {
    organisationId: '52745678-1234-1234-1234-123456781231',
    name: '',
    type: 'org',
    active: false,
    volunteer: false,
    retired: false,
    idRequirements: '',
    trustedDomains: [],
  };

  const mockEmployer = {
    employerId: '99995678-1234-1264-1234-123456781234',
    name: '',
    type: 'emp',
    active: false,
    volunteer: false,
    retired: false,
    idRequirements: '',
    trustedDomains: [],
  };

  let errorSet: APIError[];

  beforeEach(() => {
    service = new MemberProfileCustomerService(
      mockProfileRepository,
      mockOrganisationsRepository,
      mockEmployersRepository,
      mockLogger,
    );
    errorSet = [];
    jest.clearAllMocks();
    (MemberProfileCustomerModel.parse as jest.Mock).mockReturnValue(payload);
  });

  describe('upsertMemberProfile', () => {
    it('should successfully insert a new member profile', async () => {
      mockOrganisationsRepository.getOrganisations.mockResolvedValue([mockOrganisation]);
      mockEmployersRepository.getEmployers.mockResolvedValue([mockEmployer]);
      mockProfileRepository.upsertMemberProfileCustomer.mockResolvedValue();

      await service.upsertMemberProfileCustomer(query, payload, true, errorSet);

      expect(mockProfileRepository.upsertMemberProfileCustomer).toHaveBeenCalledWith(
        query,
        payload,
        true,
      );
      expect(mockLogger.info).toHaveBeenCalledWith({
        message: 'Profile created successfully',
        body: query,
      });
      expect(errorSet).toHaveLength(0);
    });

    it('should successfully update an existing member profile', async () => {
      mockOrganisationsRepository.getOrganisations.mockResolvedValue([mockOrganisation]);
      mockEmployersRepository.getEmployers.mockResolvedValue([mockEmployer]);
      mockProfileRepository.upsertMemberProfileCustomer.mockResolvedValue();

      await service.upsertMemberProfileCustomer(query, payload, false, errorSet);

      expect(mockProfileRepository.upsertMemberProfileCustomer).toHaveBeenCalledWith(
        query,
        payload,
        false,
      );
      expect(mockLogger.info).toHaveBeenCalledWith({
        message: 'Profile updated successfully',
        body: query,
      });
      expect(errorSet).toHaveLength(0);
    });

    it('should handle validation errors correctly', async () => {
      const validationError = new ZodError([
        { path: ['key'], message: 'Invalid key', code: 'custom' },
      ]);
      jest.spyOn(MemberProfileCustomerModel, 'parse').mockImplementation(() => {
        throw validationError;
      });

      await service.upsertMemberProfileCustomer(query, payload, true, errorSet);

      expect(errorSet).toHaveLength(1);
      expect(errorSet[0]).toEqual(
        new APIError(APIErrorCode.VALIDATION_ERROR, 'key', 'Invalid key'),
      );
    });

    it('should handle organisation not found', async () => {
      mockOrganisationsRepository.getOrganisations.mockResolvedValue([]);

      await service.upsertMemberProfileCustomer(query, payload, true, errorSet);

      expect(errorSet).toHaveLength(1);
      expect(errorSet[0]).toEqual(
        new APIError(APIErrorCode.VALIDATION_ERROR, 'organisationId', 'Organisation not found'),
      );
    });

    it('should handle employer not found', async () => {
      mockOrganisationsRepository.getOrganisations.mockResolvedValue([mockOrganisation]);
      mockEmployersRepository.getEmployers.mockResolvedValue([]);

      await service.upsertMemberProfileCustomer(query, payload, true, errorSet);

      expect(errorSet).toHaveLength(1);
      expect(errorSet[0]).toEqual(
        new APIError(APIErrorCode.VALIDATION_ERROR, 'employerId', 'Employer not found'),
      );
    });

    it('should handle general errors correctly', async () => {
      const generalError = new Error('General Error');
      mockProfileRepository.upsertMemberProfileCustomer.mockRejectedValue(generalError);

      await service.upsertMemberProfileCustomer(query, payload, true, errorSet);

      expect(errorSet).toHaveLength(1);
    });
  });
});
