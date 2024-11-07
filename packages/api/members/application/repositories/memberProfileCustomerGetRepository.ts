import { DynamoDBDocumentClient, QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { GetCustomerProfileQueryPayload } from '../types/customerProfileTypes';

import { CustomerApplicationModel } from '../models/customer/customerApplicationModel';
import { CustomerCardModel } from '../models/customer/customerCardModel';
import { CustomerProfileModel } from '../models/customer/customerProfileModel';

export class MemberProfileCustomerGetRepository {
  private readonly dynamoDBDocClient: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor(dynamoDB: DynamoDBDocumentClient, tableName: string) {
    this.dynamoDBDocClient = dynamoDB;
    this.tableName = tableName;
  }

  async getCustomerProfile({
    brand,
    memberUuid,
    profileUuid,
  }: GetCustomerProfileQueryPayload): Promise<CustomerProfileModel> {
    let userDetails: CustomerProfileModel | null = null;
    let cardDetails: CustomerCardModel[] = [];
    let applicationDetails: CustomerApplicationModel[] = [];

    const params: QueryCommandInput = {
      TableName: this.tableName,
      KeyConditionExpression: '#pk = :pk AND #sk = :sk',
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#sk': 'sk',
      },
      ExpressionAttributeValues: {
        ':pk': `MEMBER#${memberUuid}`,
        ':sk': `PROFILE#${profileUuid}`,
      },
    };
    const queryResult = await this.dynamoDBDocClient.send(new QueryCommand(params));

    queryResult.Items?.map((details) => {
      if (details.sk.includes('PROFILE#')) {
        userDetails = CustomerProfileModel.parse(details);
      } else if (details.sk.includes('CARD#')) {
        cardDetails.push(CustomerCardModel.parse(details));
      } else if (details.sk.includes('APPLICATION#')) {
        applicationDetails.push(CustomerApplicationModel.parse(details));
      }
    });

    if (!userDetails) {
      throw new Error('Member profile not found');
    }
    if (cardDetails.length > 1) {
      cardDetails = cardDetails.sort((a, b) => {
        if (a.cardExpiry === null) return 1;
        if (b.cardExpiry === null) return -1;
        return b.cardExpiry.getTime() - a.cardExpiry.getTime();
      });
    }

    const customerProfile: CustomerProfileModel = userDetails;
    customerProfile.card = cardDetails.length > 0 ? cardDetails[0] : null;
    customerProfile.applications = applicationDetails;

    return customerProfile;
  }
}
