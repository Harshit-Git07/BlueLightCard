import { APIGatewayProxyEvent } from 'aws-lambda';
import { CardModel } from '@blc-mono/shared/models/members/cardModel';
import { CardService } from '@blc-mono/members/application/services/cardService';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { middleware } from '@blc-mono/members/application/handlers/shared/middleware/middleware';

const service = new CardService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<CardModel> => {
  const { memberId, cardNumber } = event.pathParameters || {};
  if (!memberId || !cardNumber) {
    throw new ValidationError('Member ID and Card Number are required');
  }

  return await service.getCard(memberId, cardNumber);
};

export const handler = middleware(unwrappedHandler);
