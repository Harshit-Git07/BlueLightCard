import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { defaultDynamoDbClient } from './dynamoClient';
import { ApplyPromoCodeApplicationModel } from '@blc-mono/members/application/models/applicationModel';

export const ORGANISATION = 'ORGANISATION';
export const EMPLOYER = 'EMPLOYER';
export const ID_REQUIREMENT = 'ID_REQUIREMENT';
export const MEMBER = 'MEMBER';
export const PROFILE = 'PROFILE';
export const APPLICATION = 'APPLICATION';
export const CARD = 'CARD';
export const NOTE = 'NOTE';
export const PROMO_CODE = 'PROMO_CODE';

export function organisationKey(organisationId: string): string {
  return `${ORGANISATION}#${organisationId}`;
}

export function employerKey(employerId: string): string {
  return `${EMPLOYER}#${employerId}`;
}

export function memberKey(memberId: string): string {
  return `${MEMBER}#${memberId}`;
}

export function applicationKey(applicationId: string): string {
  return `${APPLICATION}#${applicationId}`;
}

export function cardKey(cardNumber: string): string {
  return `${CARD}#${cardNumber}`;
}

export function noteKey(noteId: string): string {
  return `${NOTE}#${noteId}`;
}

export function idRequirementKey(idRequirementCode: string): string {
  return `${ID_REQUIREMENT}#${idRequirementCode}`;
}

export function promoCodeKey(promoCodeId: string): string {
  return `${PROMO_CODE}#${promoCodeId}`;
}

export interface PartialUpdateProps<T> {
  tableName: string;
  pk: string;
  sk: string;
  data: Partial<T>;
}

export class Repository {
  constructor(readonly dynamoDB: DynamoDBDocumentClient = defaultDynamoDbClient) {}

  async partialUpdate<T>({ tableName, pk, sk, data }: PartialUpdateProps<T>): Promise<void> {
    let [updateExpression, expressionAttributeNames, expressionAttributeValues] =
      this.getPartialUpdateExpressionValues(data);

    const params = {
      TableName: tableName,
      Key: { pk, sk },
      UpdateExpression: `SET ${updateExpression.join(', ')} `,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    };

    await this.dynamoDB.send(new UpdateCommand(params));
  }

  getPartialUpdateExpressionValues<T>(
    data: Partial<T>,
  ): [string[], { [key: string]: any }, { [key: string]: any }] {
    const updateExpression: string[] = [];
    const expressionAttributeNames: { [key: string]: any } = {};
    const expressionAttributeValues: { [key: string]: any } = {};

    for (const field of Object.keys(data) as (keyof typeof data)[]) {
      if (data[field] !== undefined) {
        updateExpression.push(`#${String(field)} = :${String(field)}`);
        expressionAttributeNames[`#${String(field)}`] = String(field);
        expressionAttributeValues[`:${String(field)}`] = data[field];
      }
    }

    return [updateExpression, expressionAttributeNames, expressionAttributeValues];
  }
}
