import { APIGatewayProxyEvent } from 'aws-lambda';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { middleware } from '@blc-mono/members/application/middleware';
import { BatchService } from '@blc-mono/members/application/services/batchService';
import { CreateInternalBatchModelResponse } from '@blc-mono/shared/models/members/batchModel';

const service = new BatchService();

const unwrappedHandler = async (
  event: APIGatewayProxyEvent,
): Promise<CreateInternalBatchModelResponse> => {
  if (!event.body) {
    throw new ValidationError('Missing request body');
  }

  const { name, cardNumbers } = JSON.parse(event.body);
  return await service.createInternalBatch(name, cardNumbers);
};

export const handler = middleware(unwrappedHandler);
