import {
  DynamoDBDocument,
  QueryCommand,
  TransactWriteCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import {
  ProfileUpdatePayload,
  AddressInsertPayload,
  CreateProfilePayload,
} from '../types/memberProfilesTypes';
import { MemberProfileDB, MemberProfileDBSchema } from '../models/memberProfileModel';
import { MAP_BRAND } from '@blc-mono/core/constants/common';
import { BRAND_SCHEMA } from '@blc-mono/core/schemas/common';
import { EligibilityStatus } from '../enums/EligibilityStatus';
import { ApplicationReason } from '../enums/ApplicationReason';
export class MemberProfilesRepository {
  constructor(
    private dynamoDB: DynamoDBDocument,
    private tableName: string,
  ) {}

  async createCustomerProfiles(payload: CreateProfilePayload, brand: string): Promise<string> {
    try {
      const memberKey = `MEMBER#${crypto.randomUUID()}`;
      const profileSK = `PROFILE#${crypto.randomUUID()}`;
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
                sk: `APPLICATION#${crypto.randomUUID()}`,
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
      return memberKey.split(prefixSeparator)[1];
    } catch (error) {
      throw new Error('Failed to create member profiles');
    }
  }

  async getMemberProfiles(uuid: string): Promise<MemberProfileDB | null> {
    const queryParams = {
      TableName: this.tableName,
      KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk)',
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#sk': 'sk',
      },
      ExpressionAttributeValues: {
        ':pk': `MEMBER#${uuid}`,
        ':sk': 'PROFILE#',
      },
    };

    const queryResult = await this.dynamoDB.send(new QueryCommand(queryParams));

    if (!queryResult.Items || queryResult.Items.length === 0) {
      return null;
    }
    return MemberProfileDBSchema.parse(queryResult.Items[0]);
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

  async updateProfile(
    memberKey: string,
    profileSK: string,
    payload: ProfileUpdatePayload,
  ): Promise<void> {
    const updateParams = {
      TableName: this.tableName,
      Key: {
        pk: memberKey,
        sk: profileSK,
      },
      UpdateExpression:
        'SET firstName = :fn, lastName = :ln, dateOfBirth = :dob, mobile = :mob, gender = :gen',
      ExpressionAttributeValues: {
        ':fn': payload.firstName,
        ':ln': payload.lastName,
        ':dob': payload.dateOfBirth,
        ':mob': payload.mobile,
        ':gen': payload.gender,
      },
    };

    await this.dynamoDB.send(new UpdateCommand(updateParams));
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
