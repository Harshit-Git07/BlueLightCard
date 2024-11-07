import { Logger } from '@aws-lambda-powertools/logger';
import { MemberProfileRepository } from '../../repositories/memberProfileRepository';
import { OrganisationsRepository } from '../../repositories/organisationsRepository';
import { EmployersRepository } from '../../repositories/employersRepository';
import { MemberProfileService } from '../memberProfileService';
import {
  MemberProfileQueryPayload,
  MemberProfileUpdatePayload,
} from '../../types/memberProfileTypes';
import { MemberProfileModel } from '../../models/memberProfileModel';
import { APIError } from '../../models/APIError';
import { APIErrorCode } from '../../enums/APIErrorCode';
import { ZodError } from 'zod';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Gender } from '../../enums/Gender';

jest.mock('../../repositories/memberProfileRepository');
jest.mock('../../repositories/organisationsRepository');
jest.mock('../../repositories/employersRepository');
jest.mock('@aws-lambda-powertools/logger');
jest.mock('../../models/memberProfileModel');

const mockDynamoDBDocClient = {} as DynamoDBDocumentClient;
const mockTableName = 'test-table';
const mockProfileRepository = new MemberProfileRepository(
  mockDynamoDBDocClient,
  mockTableName,
) as jest.Mocked<MemberProfileRepository>;
const mockOrganisationsRepository = new OrganisationsRepository(
  mockDynamoDBDocClient,
  mockTableName,
) as jest.Mocked<OrganisationsRepository>;
const mockEmployersRepository = new EmployersRepository(
  mockDynamoDBDocClient,
  mockTableName,
) as jest.Mocked<EmployersRepository>;
const mockLogger = new Logger() as jest.Mocked<Logger>;

describe('MemberProfileService', () => {
  let service: MemberProfileService;
  const query: MemberProfileQueryPayload = {
    memberUUID: 'test-uuid',
    profileId: 'test-profile-id',
  };
  const payload: MemberProfileUpdatePayload = {
    firstName: 'John',
    lastName: 'Doe 2',
    dateOfBirth: '1960-01-01T00:00:00.000Z',
    phoneNumber: '123-456-7890',
    gender: Gender.MALE,
    county: 'Antrim',
    emailAddress: 'john.doe@example.com',
    emailValidated: 1,
    spareEmail: 'john.doe.spare@example.com',
    spareEmailValidated: 0,
    employmentType: 'Full-time',
    organisationId: '52745678-1234-1234-1234-123456781231',
    employerId: '99995678-1234-1264-1234-123456781234',
    employerName: 'Example Employer',
    jobTitle: 'Software Engineer',
    jobReference: 'REF123',
    signupDate: '2023-01-01T00:00:00.000Z',
    gaKey: 'GA123456',
    profileStatus: 'Active',
    lastLogin: '2023-01-01T00:00:00.000Z',
    lastIpAddress: '192.168.1.1',
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
    service = new MemberProfileService(
      mockProfileRepository,
      mockOrganisationsRepository,
      mockEmployersRepository,
      mockLogger,
    );
    errorSet = [];
    jest.clearAllMocks();
    (MemberProfileModel.parse as jest.Mock).mockReturnValue(payload);
  });

  describe('upsertMemberProfile', () => {
    it('should successfully insert a new member profile', async () => {
      mockOrganisationsRepository.getOrganisations.mockResolvedValue([mockOrganisation]);
      mockEmployersRepository.getEmployers.mockResolvedValue([mockEmployer]);
      mockProfileRepository.upsertMemberProfile.mockResolvedValue();

      await service.upsertMemberProfile(query, payload, true, errorSet);

      expect(mockProfileRepository.upsertMemberProfile).toHaveBeenCalledWith(query, payload, true);
      expect(mockLogger.info).toHaveBeenCalledWith('Profile created successfully', { query });
      expect(errorSet).toHaveLength(0);
    });

    it('should successfully update an existing member profile', async () => {
      mockOrganisationsRepository.getOrganisations.mockResolvedValue([mockOrganisation]);
      mockEmployersRepository.getEmployers.mockResolvedValue([mockEmployer]);
      mockProfileRepository.upsertMemberProfile.mockResolvedValue();

      await service.upsertMemberProfile(query, payload, false, errorSet);

      expect(mockProfileRepository.upsertMemberProfile).toHaveBeenCalledWith(query, payload, false);
      expect(mockLogger.info).toHaveBeenCalledWith('Profile updated successfully', { query });
      expect(errorSet).toHaveLength(0);
    });

    it('should handle validation errors correctly', async () => {
      const validationError = new ZodError([
        { path: ['key'], message: 'Invalid key', code: 'custom' },
      ]);
      jest.spyOn(MemberProfileModel, 'parse').mockImplementation(() => {
        throw validationError;
      });

      await service.upsertMemberProfile(query, payload, true, errorSet);

      expect(errorSet).toHaveLength(1);
      expect(errorSet[0]).toEqual(
        new APIError(APIErrorCode.VALIDATION_ERROR, 'key', 'Invalid key'),
      );
    });

    it('should handle organisation not found', async () => {
      mockOrganisationsRepository.getOrganisations.mockResolvedValue([]);

      await service.upsertMemberProfile(query, payload, true, errorSet);

      expect(errorSet).toHaveLength(1);
      expect(errorSet[0]).toEqual(
        new APIError(APIErrorCode.VALIDATION_ERROR, 'organisationId', 'Organisation not found'),
      );
    });

    it('should handle employer not found', async () => {
      mockOrganisationsRepository.getOrganisations.mockResolvedValue([mockOrganisation]);
      mockEmployersRepository.getEmployers.mockResolvedValue([]);

      await service.upsertMemberProfile(query, payload, true, errorSet);

      expect(errorSet).toHaveLength(1);
      expect(errorSet[0]).toEqual(
        new APIError(APIErrorCode.VALIDATION_ERROR, 'employerId', 'Employer not found'),
      );
    });

    it('should handle general errors correctly', async () => {
      const generalError = new Error('General Error');
      mockProfileRepository.upsertMemberProfile.mockRejectedValue(generalError);

      await service.upsertMemberProfile(query, payload, true, errorSet);

      expect(errorSet).toHaveLength(1);
    });
  });
});
