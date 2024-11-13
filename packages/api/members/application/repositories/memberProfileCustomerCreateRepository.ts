import { DynamoDBDocumentClient, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { AddressInsertPayload, CreateProfilePayload } from '../types/memberProfilesTypes';
import { EligibilityStatus } from '../enums/EligibilityStatus';
import { ApplicationReason } from '../enums/ApplicationReason';
import { v4 as uuidv4 } from 'uuid';
export class memberProfileCustomerCreateRepository {
  constructor(
    private dynamoDB: DynamoDBDocumentClient,
    private tableName: string,
  ) {}

  async createCustomerProfiles(payload: CreateProfilePayload): Promise<string> {
    try {
      const memberKey = `MEMBER#${uuidv4()}`;
      const profileSK = `PROFILE`;

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
      return memberKey.split(prefixSeparator)[1];
    } catch (error) {
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

  async insertAddressAndUpdateProfile(
    memberKey: string,
    payload: AddressInsertPayload,
  ): Promise<void> {
    const transactionItems = [
      {
        Update: {
          TableName: this.tableName,
          Key: {
            pk: memberKey,
            sk: 'PROFILE',
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
