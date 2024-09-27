import { DynamoDB } from 'aws-sdk';
import { MemberProfilesRepository } from '../memberProfilesRepository';
import { AddressInsertPayload, ProfileUpdatePayload } from '../../types/memberProfilesTypes';
import { MemberProfileDBSchema } from '../../models/memberProfileModel';

jest.mock('aws-sdk');
jest.mock('../../models/memberProfileModel', () => ({
  MembersProfilesDBSchema: {
    parse: jest.fn(),
  },
}));

describe('MemberProfileRepository', () => {
  let repository: MemberProfilesRepository;
  let mockDynamoDB: jest.Mocked<DynamoDB.DocumentClient>;

  beforeEach(() => {
    mockDynamoDB = {
      query: jest.fn(),
      update: jest.fn(),
      put: jest.fn(),
      transactWrite: jest.fn(),
    } as unknown as jest.Mocked<DynamoDB.DocumentClient>;

    (mockDynamoDB.transactWrite as jest.Mock).mockReturnValue({
      promise: jest.fn().mockResolvedValue({}),
    });

    repository = new MemberProfilesRepository(mockDynamoDB, 'TestTable');
  });

  describe('getMembersProfiles', () => {
    it('should return profile information when profile is found', async () => {
      const mockProfile = {
        pk: 'MEMBER#456',
        sk: 'PROFILE#',
        firstname: 'John',
        surname: 'Doe',
        dob: '1990-01-01',
        gender: 'male',
        mobile: '1234567890',
        email: 'john@example.com',
        email_validated: 1,
        organisation: 'TestOrg',
        employer: 'TestEmployer',
        employer_id: '123',
        ga_key: 'test-ga-key',
        county: 'TestCounty',
        employment_type: 'Full-time',
        jobtitle: 'Developer',
        reference: 'REF123',
        signup_date: '2023-01-01',
        signup_source: 'Web',
        last_ip: '192.168.1.1',
        last_login: '2023-09-01',
        blocked: false,
        card_number: '1234',
        card_expire: '2025-12-31',
        card_status: 'Active',
        card_payment_status: 'PAID_CARD',
      };

      const mockQueryResult = {
        Items: [mockProfile],
      };

      mockDynamoDB.query.mockReturnValue({
        promise: jest.fn().mockResolvedValue(mockQueryResult),
      } as any);

      (MemberProfileDBSchema.parse as jest.Mock).mockReturnValue(mockProfile);

      const result = await repository.getMemberProfiles('456');

      expect(result).toEqual(mockProfile);
      expect(mockDynamoDB.query).toHaveBeenCalledWith({
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
      const mockQueryResult = {
        Items: [],
      };
      mockDynamoDB.query.mockReturnValue({
        promise: jest.fn().mockResolvedValue(mockQueryResult),
      } as any);

      const result = await repository.getMemberProfiles('456');

      expect(result).toBeNull();
    });

    it('should throw an error when query fails', async () => {
      mockDynamoDB.query.mockReturnValue({
        promise: jest.fn().mockRejectedValue(new Error('DynamoDB error')),
      } as any);

      await expect(repository.getMemberProfiles('456')).rejects.toThrow('DynamoDB error');
    });
  });

  describe('getProfileSortKey', () => {
    it('should return the sort key when profile is found', async () => {
      const mockQueryResult = {
        Items: [{ sk: 'PROFILE#123' }],
      };
      mockDynamoDB.query.mockReturnValue({
        promise: jest.fn().mockResolvedValue(mockQueryResult),
      } as any);

      const result = await repository.getProfileSortKey('MEMBER#456');

      expect(result).toBe('PROFILE#123');
      expect(mockDynamoDB.query).toHaveBeenCalledWith({
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
      const mockQueryResult = {
        Items: [],
      };
      mockDynamoDB.query.mockReturnValue({
        promise: jest.fn().mockResolvedValue(mockQueryResult),
      } as any);

      const result = await repository.getProfileSortKey('MEMBER#456');

      expect(result).toBeNull();
    });

    it('should throw an error when query fails', async () => {
      mockDynamoDB.query.mockReturnValue({
        promise: jest.fn().mockRejectedValue(new Error('DynamoDB error')),
      } as any);

      await expect(repository.getProfileSortKey('MEMBER#456')).rejects.toThrow('DynamoDB error');
    });
  });

  describe('updateProfile', () => {
    it('should update the profile successfully', async () => {
      mockDynamoDB.update.mockReturnValue({
        promise: jest.fn().mockResolvedValue({}),
      } as any);

      const payload: ProfileUpdatePayload = {
        firstName: 'John',
        surname: 'Doe',
        dob: '1990-01-01',
        mobile: '1234567890',
        gender: 'male',
      };

      await repository.updateProfile('MEMBER#456', 'PROFILE#123', payload);

      expect(mockDynamoDB.update).toHaveBeenCalledWith({
        TableName: 'TestTable',
        Key: {
          pk: 'MEMBER#456',
          sk: 'PROFILE#123',
        },
        UpdateExpression:
          'SET firstName = :fn, surname = :sn, dob = :dob, mobile = :mob, gender = :gen',
        ExpressionAttributeValues: {
          ':fn': 'John',
          ':sn': 'Doe',
          ':dob': '1990-01-01',
          ':mob': '1234567890',
          ':gen': 'male',
        },
      });
    });

    it('should throw an error when update fails', async () => {
      mockDynamoDB.update.mockReturnValue({
        promise: jest.fn().mockRejectedValue(new Error('DynamoDB error')),
      } as any);

      const payload: ProfileUpdatePayload = {
        firstName: 'John',
        surname: 'Doe',
        dob: '1990-01-01',
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
      mockDynamoDB.transactWrite.mockReturnValue({
        promise: jest.fn().mockResolvedValue({}),
      } as any);

      const payload: AddressInsertPayload = {
        addressLine1: 'Address 1',
        addressLine2: 'Address 2',
        townCity: 'Test City',
        county: 'Test County',
        postcode: '12345',
      };

      await repository.insertAddressAndUpdateProfile('MEMBER#456', 'PROFILE#123', payload);

      expect(mockDynamoDB.transactWrite).toHaveBeenCalledWith({
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
      mockDynamoDB.transactWrite.mockReturnValue({
        promise: jest.fn().mockRejectedValue(new Error('DynamoDB error')),
      } as any);

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

  describe('insertCard', () => {
    beforeEach(() => {
      // July 19, 2024 00:00:00 UTC
      jest.spyOn(Date, 'now').mockImplementation(() => 1721030400000);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should insert a card successfully', async () => {
      mockDynamoDB.put.mockReturnValue({
        promise: jest.fn().mockResolvedValue({}),
      } as any);

      await repository.insertCard('123456', 'active');

      expect(mockDynamoDB.put).toHaveBeenCalledWith({
        TableName: 'TestTable',
        Item: {
          pk: 'MEMBER#123456',
          sk: 'CARD#123456',
          status: 'active',
          timeRequested: 1721030400, // July 19, 2024 00:00:00 UTC in UNIX timestamp
        },
      });
    });

    it('should throw an error when put operation fails', async () => {
      mockDynamoDB.put.mockReturnValue({
        promise: jest.fn().mockRejectedValue(new Error('DynamoDB error')),
      } as any);

      await expect(repository.insertCard('123456', 'active')).rejects.toThrow('DynamoDB error');
    });
  });
});
