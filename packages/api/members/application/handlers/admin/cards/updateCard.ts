import { APIGatewayProxyEvent } from 'aws-lambda';
import { middleware } from '@blc-mono/members/application/middleware';
import { UpdateCardModel } from '@blc-mono/shared/models/members/cardModel';
import { CardService } from '@blc-mono/members/application/services/cardService';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';

const service = new CardService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<void> => {
  const { memberId, cardNumber } = event.pathParameters || {};
  if (!memberId || !cardNumber) {
    throw new ValidationError('Member ID and Card Number are required');
  }

  if (!event.body) {
    throw new ValidationError('Missing request body');
  }

  const card = UpdateCardModel.parse(JSON.parse(event.body));
  await service.updateCard(memberId, cardNumber, card);
};

export const handler = middleware(unwrappedHandler);
