import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { middleware } from '../../../../middleware';
import { CardPrintBatchModel } from '@blc-mono/members/application/models/cardPrintBatchModel';

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<CardPrintBatchModel[]> => {
  return [
    {
      cardNumbers: ['ABC123456'],
    },
  ];
};

export const handler = middleware(unwrappedHandler);
