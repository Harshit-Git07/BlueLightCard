import { APIGatewayProxyEvent } from 'aws-lambda';
import { middleware } from '@blc-mono/members/application/handlers/shared/middleware/middleware';
import { CardService } from '@blc-mono/members/application/services/cardService';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { BatchedCardModel } from '@blc-mono/shared/models/members/cardModel';

const service = new CardService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<BatchedCardModel[]> => {
  const { batchNumber } = event.pathParameters || {};
  if (!batchNumber) {
    throw new ValidationError('Batch number is required');
  }

  return await service.getCardsInBatch(batchNumber);
};

export const handler = middleware(unwrappedHandler);
