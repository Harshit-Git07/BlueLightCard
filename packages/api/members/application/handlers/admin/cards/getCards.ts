import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { middleware } from '@blc-mono/members/application/middleware';
import { CardModel } from '@blc-mono/members/application/models/cardModel';
import { CardService } from '@blc-mono/members/application/services/cardService';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';

const service = new CardService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<CardModel[]> => {
  const { memberId } = event.pathParameters || {};
  if (!memberId) {
    throw new ValidationError('Member ID is required');
  }

  return await service.getCards(memberId);
};

export const handler = middleware(unwrappedHandler);
