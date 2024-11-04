import {
  DynamoDBDocumentClient,
  QueryCommand,
  TransactWriteCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { MemberProfilesRepository } from '../memberProfilesRepository';
import {
  AddressInsertPayload,
  ProfileUpdatePayload,
  CreateProfilePayload,
} from '../../types/memberProfilesTypes';
import { MemberProfileDBSchema } from '../../models/memberProfileModel';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';
import { v4 as uuidv4 } from 'uuid';

jest.mock('../../models/memberProfileModel', () => ({
  MemberProfileDBSchema: {
    parse: jest.fn(),
  },
}));

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('MemberProfileRepository', () => {
  let repository: MemberProfilesRepository;
  const mockDynamoDB = mockClient(DynamoDBDocumentClient);

  beforeEach(() => {
    repository = new MemberProfilesRepository(mockDynamoDB as any, 'TestTable');
  });

  afterEach(() => {
    mockDynamoDB.reset();
  });

  describe('createCustomerProfiles', () => {
    const brand = 'BLC_UK';
    const payload: CreateProfilePayload = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      emailAddress: 'test@mail.com',
    };
    const mockMemberUUID = '123e4567-e89b-12d3-a456-426614174000';
    const mockProfileUUID = '223e4567-e89b-12d3-a456-426614174001';
    const mockApplicationUUID = '323e4567-e89b-12d3-a456-426614174002';
    const fixedDate = new Date('2024-07-19T00:00:00.000Z');
    const mockMappedBrand = 'blc-uk';

    beforeEach(() => {
      (uuidv4 as jest.Mock)
        .mockReturnValueOnce(mockMemberUUID)
        .mockReturnValueOnce(mockProfileUUID)
        .mockReturnValueOnce(mockApplicationUUID);

      jest.spyOn(global, 'Date').mockImplementation(() => fixedDate as any);
    });

    it('should create a member profile, brand entry, and signup application successfully', async () => {
      await repository.createCustomerProfiles(payload, brand);

      expect(mockDynamoDB).toHaveReceivedCommandWith(TransactWriteCommand, {
        TransactItems: [
          {
            Put: {
              TableName: 'TestTable',
              Item: {
                pk: `MEMBER#${mockMemberUUID}`,
                sk: `PROFILE#${mockProfileUUID}`,
                firstName: payload.firstName,
                lastName: payload.lastName,
                dateOfBirth: payload.dateOfBirth,
                emailAddress: payload.emailAddress,
              },
            },
          },
          {
            Put: {
              TableName: 'TestTable',
              Item: {
                pk: `MEMBER#${mockMemberUUID}`,
                sk: `BRAND#${mockMappedBrand}`,
              },
            },
          },
          {
            Put: {
              TableName: 'TestTable',
              Item: {
                pk: `MEMBER#${mockMemberUUID}`,
                sk: `APPLICATION#${mockApplicationUUID}`,
                startDate: fixedDate.toISOString(),
                eligibilityStatus: 'INELIGIBLE',
                applicationReason: 'SIGNUP',
                verificationMethod: '',
              },
            },
          },
        ],
      });
    });

    it('should return the member_uuid without the MEMBER# prefix', async () => {
      const result = await repository.createCustomerProfiles(payload, brand);

      expect(result).toBe(mockMemberUUID);
    });

    it('should throw an error if transactWrite fails', async () => {
      mockDynamoDB.on(TransactWriteCommand).rejects(new Error('DynamoDB error'));

      await expect(repository.createCustomerProfiles(payload, brand)).rejects.toThrow(
        'Failed to create member profiles',
      );
    });
  });

  describe('getMemberProfiles', () => {
    it('should return profile information when profile is found', async () => {
      const mockProfile = {
        pk: 'MEMBER#456',
        sk: 'PROFILE#',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        mobile: '1234567890',
        emailAddress: 'john@example.com',
        emailValidated: 1,
        spareEmailValidated: 0,
        organisation: 'TestOrg',
        employer: 'TestEmployer',
        employerId: '123',
        gaKey: 'test-ga-key',
        county: 'TestCounty',
        employmentType: 'Full-time',
        jobTitle: 'Developer',
        reference: 'REF123',
        signupDate: '2023-01-01',
        signupSource: 'Web',
        lastIp: '192.168.1.1',
        lastLogin: '2023-09-01',
        blocked: false,
        cardNumber: '1234',
        cardExpire: '2025-12-31',
        cardStatus: 'Active',
        cardPaymentStatus: 'PAID_CARD',
      };

      const mockQueryResult = {
        Items: [mockProfile],
      };

      mockDynamoDB.on(QueryCommand).resolves(mockQueryResult);

      (MemberProfileDBSchema.parse as jest.Mock).mockReturnValue(mockProfile);

      const result = await repository.getMemberProfiles('456');

      expect(result).toEqual(mockProfile);
      expect(mockDynamoDB).toHaveReceivedCommandWith(QueryCommand, {
        TableName: 'TestTable',
        KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk)',
        ExpressionAttributeNames: {
          '#pk': 'pk',
          '#sk': 'sk',
        },
        ExpressionAttributeValues: {
          ':pk': 'MEMBER#456',
          ':sk': 'PROFILE#',
        },
      });
      expect(MemberProfileDBSchema.parse).toHaveBeenCalledWith(mockProfile);
    });

    it('should return null when profile is not found', async () => {
      const mockQueryResult = { Items: [] };
      mockDynamoDB.on(QueryCommand).resolves(mockQueryResult);

      const result = await repository.getMemberProfiles('456');

      expect(result).toBeNull();
    });

    it('should throw an error when query fails', async () => {
      mockDynamoDB.on(QueryCommand).rejects(new Error('DynamoDB error'));

      await expect(repository.getMemberProfiles('456')).rejects.toThrow('DynamoDB error');
    });
  });

  describe('getProfileSortKey', () => {
    it('should return the sort key when profile is found', async () => {
      const mockQueryResult = {
        Items: [{ sk: 'PROFILE#123' }],
      };
      mockDynamoDB.on(QueryCommand).resolves(mockQueryResult);

      const result = await repository.getProfileSortKey('MEMBER#456');

      expect(result).toBe('PROFILE#123');
      expect(mockDynamoDB).toHaveReceivedCommandWith(QueryCommand, {
        TableName: 'TestTable',
        KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk)',
        ExpressionAttributeNames: {
          '#pk': 'pk',
          '#sk': 'sk',
        },
        ExpressionAttributeValues: {
          ':pk': 'MEMBER#456',
          ':sk': 'PROFILE#',
        },
      });
    });

    it('should return null when profile is not found', async () => {
      const mockQueryResult = { Items: [] };
      mockDynamoDB.on(QueryCommand).resolves(mockQueryResult);

      const result = await repository.getProfileSortKey('MEMBER#456');

      expect(result).toBeNull();
    });

    it('should throw an error when query fails', async () => {
      mockDynamoDB.on(QueryCommand).rejects(new Error('DynamoDB error'));

      await expect(repository.getProfileSortKey('MEMBER#456')).rejects.toThrow('DynamoDB error');
    });
  });

  describe('updateProfile', () => {
    it('should update the profile successfully', async () => {
      mockDynamoDB.on(UpdateCommand).resolves({});
      const payload: ProfileUpdatePayload = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        mobile: '1234567890',
        gender: 'male',
      };

      await repository.updateProfile('MEMBER#456', 'PROFILE#123', payload);

      expect(mockDynamoDB).toHaveReceivedCommandWith(UpdateCommand, {
        TableName: 'TestTable',
        Key: {
          pk: 'MEMBER#456',
          sk: 'PROFILE#123',
        },
        UpdateExpression:
          'SET firstName = :fn, lastName = :ln, dateOfBirth = :dob, mobile = :mob, gender = :gen',
        ExpressionAttributeValues: {
          ':fn': 'John',
          ':ln': 'Doe',
          ':dob': '1990-01-01',
          ':mob': '1234567890',
          ':gen': 'male',
        },
      });
    });

    it('should throw an error when update fails', async () => {
      mockDynamoDB.on(UpdateCommand).rejects(new Error('DynamoDB error'));

      const payload: ProfileUpdatePayload = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        mobile: '1234567890',
        gender: 'male',
      };

      await expect(repository.updateProfile('MEMBER#456', 'PROFILE#123', payload)).rejects.toThrow(
        'DynamoDB error',
      );
    });
  });

  describe('insertAddressAndUpdateProfile', () => {
    it('should insert address and update profile successfully', async () => {
      mockDynamoDB.on(TransactWriteCommand).resolves({});

      const payload: AddressInsertPayload = {
        addressLine1: 'Address 1',
        addressLine2: 'Address 2',
        townCity: 'Test City',
        county: 'Test County',
        postcode: '12345',
      };

      await repository.insertAddressAndUpdateProfile('MEMBER#456', 'PROFILE#123', payload);

      expect(mockDynamoDB).toHaveReceivedCommandWith(TransactWriteCommand, {
        TransactItems: [
          {
            Update: {
              TableName: 'TestTable',
              Key: {
                pk: 'MEMBER#456',
                sk: 'PROFILE#123',
              },
              UpdateExpression: 'SET county = :county',
              ExpressionAttributeValues: {
                ':county': 'Test County',
              },
            },
          },
          {
            Put: {
              TableName: 'TestTable',
              Item: {
                pk: 'MEMBER#456',
                sk: 'ADDRESS',
                addressLine1: 'Address 1',
                addressLine2: 'Address 2',
                townCity: 'Test City',
                county: 'Test County',
                postcode: '12345',
              },
            },
          },
        ],
      });
    });

    it('should throw an error when transactWrite fails', async () => {
      mockDynamoDB.on(TransactWriteCommand).rejects(new Error('DynamoDB error'));

      const payload: AddressInsertPayload = {
        addressLine1: 'Address 1',
        townCity: 'Test City',
        county: 'Test County',
        postcode: '12345',
      };

      await expect(
        repository.insertAddressAndUpdateProfile('MEMBER#456', 'PROFILE#123', payload),
      ).rejects.toThrow('DynamoDB error');
    });
  });
});
