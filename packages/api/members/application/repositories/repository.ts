import {
  BatchWriteCommand,
  BatchWriteCommandInput,
  BatchWriteCommandOutput,
  DynamoDBDocumentClient,
  ScanCommand,
  ScanCommandInput,
  ScanCommandOutput,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { defaultDynamoDbClient } from './dynamoClient';

export const ORGANISATION = 'ORGANISATION';
export const EMPLOYER = 'EMPLOYER';
export const ID_REQUIREMENT = 'ID_REQUIREMENT';
export const MEMBER = 'MEMBER';
export const PROFILE = 'PROFILE';
export const APPLICATION = 'APPLICATION';
export const CARD = 'CARD';
export const NOTE = 'NOTE';
export const PROMO_CODE = 'PROMO_CODE';
export const BATCH = 'BATCH';

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

export function batchKey(batchId: string): string {
  return `${BATCH}#${batchId}`;
}

export interface PartialUpdateProps<T> {
  tableName: string;
  pk: string;
  sk: string;
  data: Partial<T>;
}

const DYNAMODB_MAX_BATCH_WRITE_SIZE = 25;
const MAX_BATCH_RETRY_ATTEMPTS = 5;
const MAX_BASE_DELAY = 1000;

export class Repository {
  constructor(readonly dynamoDB: DynamoDBDocumentClient = defaultDynamoDbClient) {}

  async scan(params: ScanCommandInput): Promise<ScanCommandOutput> {
    try {
      const scanCommand = new ScanCommand(params);

      return this.dynamoDB.send(scanCommand);
    } catch (error) {
      const message = 'Error trying to scan record using DynamoDB service';
      throw new Error(`${message}: [${error}]`);
    }
  }

  async partialUpdate<T>({ tableName, pk, sk, data }: PartialUpdateProps<T>): Promise<void> {
    let [updateExpression, expressionAttributeNames, expressionAttributeValues] =
      this.getPartialUpdateExpressionValues(data);

    const params = {
      TableName: tableName,
      Key: {
        pk,
        sk,
      },
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

  async batchInsert<T>(items: Record<string, T>[], tableName: string): Promise<void> {
    for (let i = 0; i < items.length; i += DYNAMODB_MAX_BATCH_WRITE_SIZE) {
      const chunk = items.slice(i, i + DYNAMODB_MAX_BATCH_WRITE_SIZE);
      await this.batchWrite({
        RequestItems: {
          [tableName]: chunk.map((item) => ({
            PutRequest: {
              Item: item,
            },
          })),
        },
      });
    }
  }

  private async batchWrite(params: BatchWriteCommandInput): Promise<void> {
    try {
      let data: BatchWriteCommandOutput;
      data = await this.dynamoDB.send(new BatchWriteCommand(params));

      let attempt = 0;

      while (
        data.UnprocessedItems &&
        Object.keys(data.UnprocessedItems).length > 0 &&
        attempt < MAX_BATCH_RETRY_ATTEMPTS
      ) {
        attempt++;
        const delay = this.getBackoffDelayWithJitter(attempt);

        await new Promise((resolve) => setTimeout(resolve, delay));

        data = await this.dynamoDB.send(
          new BatchWriteCommand({
            ...params,
            RequestItems: data.UnprocessedItems,
          }),
        );
      }
    } catch (error) {
      const message = 'Error trying to batch write records using DynamoDB service';
      throw new Error(`${message}: [${error}]`);
    }
  }

  private getBackoffDelayWithJitter(attempt: number): number {
    const delay = MAX_BASE_DELAY * Math.pow(2, attempt);

    return delay + Math.random() * delay;
  }
}
