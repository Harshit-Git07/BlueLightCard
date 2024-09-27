import { DynamoDB } from 'aws-sdk';
import { ProfileUpdatePayload, AddressInsertPayload } from '../types/memberProfilesTypes';
import { MemberProfileDB, MemberProfileDBSchema } from '../models/memberProfileModel';

export class MemberProfilesRepository {
  constructor(private dynamoDB: DynamoDB.DocumentClient, private tableName: string) {}

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

    const queryResult = await this.dynamoDB.query(queryParams).promise();

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

    const queryResult = await this.dynamoDB.query(queryParams).promise();

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
        'SET firstName = :fn, surname = :sn, dob = :dob, mobile = :mob, gender = :gen',
      ExpressionAttributeValues: {
        ':fn': payload.firstName,
        ':sn': payload.surname,
        ':dob': payload.dob,
        ':mob': payload.mobile,
        ':gen': payload.gender,
      },
    };

    await this.dynamoDB.update(updateParams).promise();
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

    await this.dynamoDB.transactWrite({ TransactItems: transactionItems }).promise();
  }

  async insertCard(memberUUID: string, cardStatus: string): Promise<void> {
    const cardNumber = '123456'; // Placeholder value
    const now = Math.floor(Date.now() / 1000); // UNIX timestamp
    const params = {
      TableName: this.tableName,
      Item: {
        pk: `MEMBER#${memberUUID}`,
        sk: `CARD#${cardNumber}`,
        status: cardStatus,
        timeRequested: now,
      },
    };

    await this.dynamoDB.put(params).promise();
  }
}
