import { APIGatewayProxyHandler } from 'aws-lambda';
import { LambdaLogger as Logger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { validateRequest } from '../../utils/requestValidator';
import { MemberCardQueryPayload, MemberCardUpdatePayload } from '../../types/memberCardTypes';
import { MemberCardRepository } from '../../../application/repositories/memberCardRepository';
import { MemberCardService } from '../../../application/services/memberCardService';
import { datadog } from 'datadog-lambda-js';
import 'dd-trace/init';

const service: string = process.env.SERVICE as string;
const logger = new Logger({ serviceName: `${service}-updateMemberCard` });
const USE_DATADOG_AGENT = process.env.USE_DATADOG_AGENT ?? 'false';

const tableName = process.env.IDENTITY_TABLE_NAME as string;
const dynamoDB = DynamoDBDocument.from(new DynamoDB({ region: process.env.REGION ?? 'eu-west-2' }));

const repository = new MemberCardRepository(dynamoDB, tableName);
const cardService = new MemberCardService(repository, logger);

const handlerUnwrapped: APIGatewayProxyHandler = async (event) => {
  try {
    const { brand, uuid, cardNumber } = event.pathParameters || {};

    if (!uuid || !brand || !cardNumber) {
      logger.error({ message: 'Missing required query parameters' });
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Invalid Request: uuid, brand, and cardNumber are required',
        }),
      };
    }

    const validationResult = validateRequest(event, logger);

    if ('statusCode' in validationResult) {
      return validationResult;
    }

    const { body } = validationResult;
    const queryPayload: MemberCardQueryPayload = {
      uuid: uuid,
      brand: brand,
      cardNumber: cardNumber,
    };
    const updatePayload: MemberCardUpdatePayload = body;

    await cardService.updateMemberCard(queryPayload, updatePayload);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Member card updated successfully' }),
    };
  } catch (error) {
    logger.error({
      message: 'Error updating member card',
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    if (error instanceof Error) {
      if ('code' in error && (error as any).code === 'ConditionalCheckFailedException') {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'Member profile and/or card not found' }),
        };
      }
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
export const handler = USE_DATADOG_AGENT === 'true' ? datadog(handlerUnwrapped) : handlerUnwrapped;
