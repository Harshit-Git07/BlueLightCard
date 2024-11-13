import { DynamoDBDocumentClient, QueryCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { memberProfileCustomerCreateRepository } from '../memberProfileCustomerCreateRepository';
import { AddressInsertPayload, CreateProfilePayload } from '../../types/memberProfilesTypes';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';
import { v4 as uuidv4 } from 'uuid';
import { ApplicationReason } from '../../enums/ApplicationReason';
import { EligibilityStatus } from '../../enums/EligibilityStatus';

jest.mock('../../models/memberProfilesModel', () => ({
  MemberProfileDBSchema: {
    parse: jest.fn(),
  },
}));

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('memberProfileCustomerCreateRepository', () => {
  let repository: memberProfileCustomerCreateRepository;
  const mockDynamoDB = mockClient(DynamoDBDocumentClient);

  beforeEach(() => {
    repository = new memberProfileCustomerCreateRepository(mockDynamoDB as any, 'TestTable');
  });

  afterEach(() => {
    mockDynamoDB.reset();
  });

  describe('createCustomerProfiles', () => {
    const payload: CreateProfilePayload = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      emailAddress: 'test@mail.com',
    };
    const mockMemberUUID = '123e4567-e89b-12d3-a456-426614174000';
    const mockApplicationUUID = '323e4567-e89b-12d3-a456-426614174002';
    const fixedDate = new Date('2024-07-19T00:00:00.000Z');

    beforeEach(() => {
      (uuidv4 as jest.Mock)
        .mockReturnValueOnce(mockMemberUUID)
        .mockReturnValueOnce(mockApplicationUUID);

      jest.spyOn(global, 'Date').mockImplementation(() => fixedDate as any);
    });

    it('should create a member profile, and signup application successfully', async () => {
      await repository.createCustomerProfiles(payload);

      expect(mockDynamoDB).toHaveReceivedCommandWith(TransactWriteCommand, {
        TransactItems: [
          {
            Put: {
              TableName: 'TestTable',
              Item: {
                pk: `MEMBER#${mockMemberUUID}`,
                sk: `PROFILE`,
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
                sk: `APPLICATION#${mockApplicationUUID}`,
                startDate: fixedDate.toISOString(),
                eligibilityStatus: EligibilityStatus.INELIGIBLE,
                applicationReason: ApplicationReason.SIGNUP,
                verificationMethod: '',
              },
            },
          },
        ],
      });
    });

    it('should return the member_uuid without the MEMBER# prefix', async () => {
      const result = await repository.createCustomerProfiles(payload);

      expect(result).toStrictEqual(mockMemberUUID);
    });

    it('should throw an error if transactWrite fails', async () => {
      mockDynamoDB.on(TransactWriteCommand).rejects(new Error('DynamoDB error'));

      await expect(repository.createCustomerProfiles(payload)).rejects.toThrow(
        'Failed to create member profiles',
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

      await repository.insertAddressAndUpdateProfile('MEMBER#456', payload);

      expect(mockDynamoDB).toHaveReceivedCommandWith(TransactWriteCommand, {
        TransactItems: [
          {
            Update: {
              TableName: 'TestTable',
              Key: {
                pk: 'MEMBER#456',
                sk: 'PROFILE',
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

      await expect(repository.insertAddressAndUpdateProfile('MEMBER#456', payload)).rejects.toThrow(
        'DynamoDB error',
      );
    });
  });
});
