import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { LambdaLogger as Logger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { Response } from '@blc-mono/core/utils/restResponse/response';
import { MemberCardRepository } from 'application/repositories/memberCardRepository';
import { MemberCardService } from 'application/services/memberCardService';
import { MemberCardQueryPayload } from 'application/types/memberCardTypes';
import { datadog } from 'datadog-lambda-js';
import 'dd-trace/init';

const service: string = process.env.SERVICE as string;
const logger = new Logger({ serviceName: `${service}-getMemberCard` });
const USE_DATADOG_AGENT = process.env.USE_DATADOG_AGENT ?? 'false';

const tableName = process.env.IDENTITY_TABLE_NAME as string;
const dynamoDB = DynamoDBDocument.from(new DynamoDB({ region: process.env.REGION ?? 'eu-west-2' }));

const repository = new MemberCardRepository(dynamoDB, tableName);
const cardService = new MemberCardService(repository, logger);

const handlerUnwrapped = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const { brand, uuid, cardNumber } = event.pathParameters || {};

  if (!uuid || !brand) {
    logger.error({ message: 'Missing required query parameters' });
    return Response.BadRequest({ message: 'Bad Request: uuid and brand are required' });
  }

  try {
    const payload: MemberCardQueryPayload = {
      uuid: uuid,
      brand: brand,
      cardNumber: cardNumber,
    };

    const memberCard = await cardService.getMemberCards(payload);

    if (memberCard && memberCard.length > 0) {
      return {
        statusCode: 200,
        body: JSON.stringify(memberCard),
      };
    } else {
      return Response.NotFound({ message: 'No matching member cards found' });
    }
  } catch (error) {
    logger.error({
      message: 'Error fetching member card',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    if (error instanceof Error) {
      return Response.Error(error);
    } else {
      return Response.Error(new Error('Unknown error occurred while fetching member card'));
    }
  }
};
export const handler = USE_DATADOG_AGENT === 'true' ? datadog(handlerUnwrapped) : handlerUnwrapped;
