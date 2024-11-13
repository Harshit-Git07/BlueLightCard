import {
  DynamoDBDocumentClient,
  QueryCommand,
  TransactWriteCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import {
  ProfileUpdatePayload,
  AddressInsertPayload,
  CreateProfilePayload,
} from '../types/memberProfilesTypes';
import { MemberProfileDB, MemberProfileDBSchema } from '../models/memberProfilesModel';
import { MAP_BRAND } from '@blc-mono/core/constants/common';
import { BRAND_SCHEMA } from '@blc-mono/core/schemas/common';
import { EligibilityStatus } from '../enums/EligibilityStatus';
import { ApplicationReason } from '../enums/ApplicationReason';
import { v4 as uuidv4 } from 'uuid';
export class memberProfileCustomerCreateRepository {
  constructor(
    private dynamoDB: DynamoDBDocumentClient,
    private tableName: string,
  ) {}

  async createCustomerProfiles(
    payload: CreateProfilePayload,
    brand: string,
  ): Promise<[string, string]> {
    try {
      const memberKey = `MEMBER#${uuidv4()}`;
      const profileSK = `PROFILE#${uuidv4()}`;
      const brandSK = `BRAND#${MAP_BRAND[BRAND_SCHEMA.parse(brand)]}`;

      const params = {
        TransactItems: [
          {
            Put: {
              TableName: this.tableName,
              Item: {
                pk: memberKey,
                sk: profileSK,
                firstName: payload.firstName,
                lastName: payload.lastName,
                ...(payload.dateOfBirth && { dateOfBirth: payload.dateOfBirth }),
                emailAddress: payload.emailAddress,
              },
            },
          },
          {
            Put: {
              TableName: this.tableName,
              Item: {
                pk: memberKey,
                sk: brandSK,
              },
            },
          },
          {
            Put: {
              TableName: this.tableName,
              Item: {
                pk: memberKey,
                sk: `APPLICATION#${uuidv4()}`,
                startDate: new Date().toISOString(),
                eligibilityStatus: EligibilityStatus.INELIGIBLE,
                applicationReason: ApplicationReason.SIGNUP,
                verificationMethod: '',
              },
            },
          },
        ],
      };

      await this.dynamoDB.send(new TransactWriteCommand(params));
      const prefixSeparator = '#';
      return [memberKey.split(prefixSeparator)[1], profileSK.split(prefixSeparator)[1]];
    } catch (error: Error | unknown) {
      if (error instanceof Error) {
        throw new Error(
          JSON.stringify({
            message: 'Failed to create member profiles',
            error: {
              name: (error as Error).name,
              message: (error as Error).message,
              stack: (error as Error).stack,
            },
          }),
        );
      } else {
        throw new Error('Failed to create member profiles');
      }
    }
  }

  async getProfileSortKey(memberKey: string): Promise<string | null> {
    const queryParams = {
      TableName: this.tableName,
      KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk)',
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#sk': 'sk',
      },
      ExpressionAttributeValues: {
        ':pk': memberKey,
        ':sk': 'PROFILE#',
      },
    };

    const queryResult = await this.dynamoDB.send(new QueryCommand(queryParams));

    if (!queryResult.Items || queryResult.Items.length === 0) {
      return null;
    }

    return queryResult.Items[0].sk;
  }

  async insertAddressAndUpdateProfile(
    memberKey: string,
    profileSK: string,
    payload: AddressInsertPayload,
  ): Promise<void> {
    const transactionItems = [
      {
        Update: {
          TableName: this.tableName,
          Key: {
            pk: memberKey,
            sk: profileSK,
          },
          UpdateExpression: 'SET county = :county',
          ExpressionAttributeValues: {
            ':county': payload.county,
          },
        },
      },
      {
        Put: {
          TableName: this.tableName,
          Item: {
            pk: memberKey,
            sk: 'ADDRESS',
            addressLine1: payload.addressLine1,
            addressLine2: payload.addressLine2,
            townCity: payload.townCity,
            county: payload.county,
            postcode: payload.postcode,
          },
        },
      },
    ];

    await this.dynamoDB.send(new TransactWriteCommand({ TransactItems: transactionItems }));
  }
}
