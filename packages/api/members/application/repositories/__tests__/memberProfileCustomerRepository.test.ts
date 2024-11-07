import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { MemberProfileCustomerRepository } from '../memberProfileCustomerRepository';
import { MemberProfileCustomerModel } from '../../models/memberProfileCustomerModel';
import {
  MemberProfileCustomerUpdatePayload,
  MemberProfileCustomerQueryPayload,
} from '../../types/memberProfileCustomerTypes';
import { Gender } from '../../enums/Gender';

jest.mock('@aws-sdk/lib-dynamodb');
jest.mock('../../models/memberProfileCustomerModel');

const mockDynamoDBClient = {
  send: jest.fn(),
} as unknown as jest.Mocked<DynamoDBDocumentClient>;
const mockUpdateCommand = UpdateCommand as jest.MockedClass<typeof UpdateCommand>;
const mockMemberProfileCustomerModel = MemberProfileCustomerModel as jest.Mocked<
  typeof MemberProfileCustomerModel
>;

describe('MemberProfileCustomerRepository', () => {
  let repository: MemberProfileCustomerRepository;
  const tableName = 'test-table';

  beforeEach(() => {
    repository = new MemberProfileCustomerRepository(mockDynamoDBClient, tableName);
    jest.clearAllMocks();
  });

  describe('upsertMemberProfileCustomer', () => {
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

    mockMemberProfileCustomerModel.parse.mockReturnValue({
      memberId: query.memberUUID,
      profileId: query.profileId,
      ...payload,
    });

    it('should successfully upsert (insert) a member profile', async () => {
      await repository.upsertMemberProfileCustomer(query, payload, true);

      expect(mockUpdateCommand).toHaveBeenCalledWith({
        TableName: tableName,
        Key: {
          pk: `MEMBER#${query.memberUUID}`,
          sk: `PROFILE#${query.profileId}`,
        },
        UpdateExpression: `SET dateOfBirth = :dateOfBirth, phoneNumber = :phoneNumber, gender = :gender, county = :county, employmentType = :employmentType, organisationId = :organisationId, employerId = :employerId, jobTitle = :jobTitle, jobReference = :jobReference `,
        ConditionExpression: 'pk <> :pk OR sk <> :sk',
        ExpressionAttributeValues: {
          ':dateOfBirth': payload.dateOfBirth,
          ':phoneNumber': payload.phoneNumber,
          ':gender': payload.gender,
          ':county': payload.county,
          ':employmentType': payload.employmentType,
          ':organisationId': payload.organisationId,
          ':employerId': payload.employerId,
          ':jobTitle': payload.jobTitle,
          ':jobReference': payload.jobReference,
          ':pk': `MEMBER#${query.memberUUID}`,
          ':sk': `PROFILE#${query.profileId}`,
        },
      });
      expect(mockDynamoDBClient.send).toHaveBeenCalledWith(expect.any(UpdateCommand));
    });

    it('should successfully upsert (update) a member profile', async () => {
      await repository.upsertMemberProfileCustomer(query, payload, false);

      expect(mockUpdateCommand).toHaveBeenCalledWith({
        TableName: tableName,
        Key: {
          pk: `MEMBER#${query.memberUUID}`,
          sk: `PROFILE#${query.profileId}`,
        },
        UpdateExpression: `SET dateOfBirth = :dateOfBirth, phoneNumber = :phoneNumber, gender = :gender, county = :county, employmentType = :employmentType, organisationId = :organisationId, employerId = :employerId, jobTitle = :jobTitle, jobReference = :jobReference `,
        ConditionExpression: 'pk = :pk AND sk = :sk',
        ExpressionAttributeValues: {
          ':dateOfBirth': payload.dateOfBirth,
          ':phoneNumber': payload.phoneNumber,
          ':gender': payload.gender,
          ':county': payload.county,
          ':employmentType': payload.employmentType,
          ':organisationId': payload.organisationId,
          ':employerId': payload.employerId,
          ':jobTitle': payload.jobTitle,
          ':jobReference': payload.jobReference,
          ':pk': `MEMBER#${query.memberUUID}`,
          ':sk': `PROFILE#${query.profileId}`,
        },
      });
      expect(mockDynamoDBClient.send).toHaveBeenCalledWith(expect.any(UpdateCommand));
    });

    it('should throw an error if payload validation fails', async () => {
      mockMemberProfileCustomerModel.parse.mockImplementation(() => {
        throw new Error('Validation Error');
      });

      await expect(repository.upsertMemberProfileCustomer(query, payload, true)).rejects.toThrow(
        'Validation Error',
      );
    });

    it('should handle DynamoDB errors correctly', async () => {
      mockDynamoDBClient.send.mockRejectedValue(new Error('Validation Error') as unknown as never);

      await expect(repository.upsertMemberProfileCustomer(query, payload, true)).rejects.toThrow(
        'Validation Error',
      );
    });
  });
});
