import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { MemberProfileRepository } from '../memberProfileRepository';
import { MemberProfileModel } from '../../models/memberProfileModel';
import {
  MemberProfileUpdatePayload,
  MemberProfileQueryPayload,
} from '../../types/memberProfileTypes';
import { Gender } from '../../enums/Gender';

jest.mock('@aws-sdk/lib-dynamodb');
jest.mock('../../models/memberProfileModel');

const mockDynamoDBClient = {
  send: jest.fn(),
} as unknown as jest.Mocked<DynamoDBDocumentClient>;
const mockUpdateCommand = UpdateCommand as jest.MockedClass<typeof UpdateCommand>;
const mockMemberProfileModel = MemberProfileModel as jest.Mocked<typeof MemberProfileModel>;

describe('MemberProfileRepository', () => {
  let repository: MemberProfileRepository;
  const tableName = 'test-table';
  const noteTableName = 'test-note-table';

  beforeEach(() => {
    repository = new MemberProfileRepository(mockDynamoDBClient, tableName, noteTableName);
    jest.clearAllMocks();
  });

  describe('upsertMemberProfile', () => {
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

    mockMemberProfileModel.parse.mockReturnValue({
      memberId: query.memberUUID,
      profileId: query.profileId,
      ...payload,
    } as any);

    it('should successfully upsert (insert) a member profile', async () => {
      await repository.upsertMemberProfile(query, payload, true);

      expect(mockUpdateCommand).toHaveBeenCalledWith({
        TableName: tableName,
        Key: {
          pk: `MEMBER#${query.memberUUID}`,
          sk: `PROFILE#${query.profileId}`,
        },
        UpdateExpression: `SET firstName = :firstName, lastName = :lastName, dateOfBirth = :dateOfBirth, phoneNumber = :phoneNumber, gender = :gender, county = :county, emailAddress = :emailAddress, emailValidated = :emailValidated, spareEmail = :spareEmail, spareEmailValidated = :spareEmailValidated, employmentType = :employmentType, organisationId = :organisationId, employerId = :employerId, employerName = :employerName, jobTitle = :jobTitle, jobReference = :jobReference, signupDate = :signupDate, gaKey = :gaKey, profileStatus = :profileStatus, lastLogin = :lastLogin, lastIpAddress = :lastIpAddress `,
        ConditionExpression: 'pk <> :pk OR sk <> :sk',
        ExpressionAttributeValues: {
          ':firstName': payload.firstName,
          ':lastName': payload.lastName,
          ':dateOfBirth': payload.dateOfBirth,
          ':phoneNumber': payload.phoneNumber,
          ':gender': payload.gender,
          ':county': payload.county,
          ':emailAddress': payload.emailAddress,
          ':emailValidated': payload.emailValidated,
          ':spareEmail': payload.spareEmail,
          ':spareEmailValidated': payload.spareEmailValidated,
          ':employmentType': payload.employmentType,
          ':organisationId': payload.organisationId,
          ':employerId': payload.employerId,
          ':employerName': payload.employerName,
          ':jobTitle': payload.jobTitle,
          ':jobReference': payload.jobReference,
          ':signupDate': payload.signupDate,
          ':gaKey': payload.gaKey,
          ':profileStatus': payload.profileStatus,
          ':lastLogin': payload.lastLogin,
          ':lastIpAddress': payload.lastIpAddress,
          ':pk': `MEMBER#${query.memberUUID}`,
          ':sk': `PROFILE#${query.profileId}`,
        },
      });
      expect(mockDynamoDBClient.send).toHaveBeenCalledWith(expect.any(UpdateCommand));
    });

    it('should successfully upsert (update) a member profile', async () => {
      await repository.upsertMemberProfile(query, payload, false);

      expect(mockUpdateCommand).toHaveBeenCalledWith({
        TableName: tableName,
        Key: {
          pk: `MEMBER#${query.memberUUID}`,
          sk: `PROFILE#${query.profileId}`,
        },
        UpdateExpression: `SET firstName = :firstName, lastName = :lastName, dateOfBirth = :dateOfBirth, phoneNumber = :phoneNumber, gender = :gender, county = :county, emailAddress = :emailAddress, emailValidated = :emailValidated, spareEmail = :spareEmail, spareEmailValidated = :spareEmailValidated, employmentType = :employmentType, organisationId = :organisationId, employerId = :employerId, employerName = :employerName, jobTitle = :jobTitle, jobReference = :jobReference, signupDate = :signupDate, gaKey = :gaKey, profileStatus = :profileStatus, lastLogin = :lastLogin, lastIpAddress = :lastIpAddress `,
        ConditionExpression: 'pk = :pk AND sk = :sk',
        ExpressionAttributeValues: {
          ':firstName': payload.firstName,
          ':lastName': payload.lastName,
          ':dateOfBirth': payload.dateOfBirth,
          ':phoneNumber': payload.phoneNumber,
          ':gender': payload.gender,
          ':county': payload.county,
          ':emailAddress': payload.emailAddress,
          ':emailValidated': payload.emailValidated,
          ':spareEmail': payload.spareEmail,
          ':spareEmailValidated': payload.spareEmailValidated,
          ':employmentType': payload.employmentType,
          ':organisationId': payload.organisationId,
          ':employerId': payload.employerId,
          ':employerName': payload.employerName,
          ':jobTitle': payload.jobTitle,
          ':jobReference': payload.jobReference,
          ':signupDate': payload.signupDate,
          ':gaKey': payload.gaKey,
          ':profileStatus': payload.profileStatus,
          ':lastLogin': payload.lastLogin,
          ':lastIpAddress': payload.lastIpAddress,
          ':pk': `MEMBER#${query.memberUUID}`,
          ':sk': `PROFILE#${query.profileId}`,
        },
      });
      expect(mockDynamoDBClient.send).toHaveBeenCalledWith(expect.any(UpdateCommand));
    });

    it('should throw an error if payload validation fails', async () => {
      mockMemberProfileModel.parse.mockImplementation(() => {
        throw new Error('Validation Error');
      });

      await expect(repository.upsertMemberProfile(query, payload, true)).rejects.toThrow(
        'Validation Error',
      );
    });

    it('should handle DynamoDB errors correctly', async () => {
      mockDynamoDBClient.send.mockRejectedValue(new Error('Validation Error') as unknown as never);

      await expect(repository.upsertMemberProfile(query, payload, true)).rejects.toThrow(
        'Validation Error',
      );
    });
  });
});
