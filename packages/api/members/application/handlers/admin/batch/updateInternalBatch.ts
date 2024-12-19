import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { middleware } from '@blc-mono/members/application/middleware';
import { BatchService } from '@blc-mono/members/application/services/batchService';
import { CreateInternalBatchModelResponse } from '@blc-mono/members/application/models/batchModel';

const service = new BatchService();

const unwrappedHandler = async (
  event: APIGatewayProxyEvent,
): Promise<CreateInternalBatchModelResponse> => {
  if (!event.body) {
    throw new ValidationError('Missing request body');
  }

  const { batchId, cardNumbers } = JSON.parse(event.body);
  return await service.updateInternalBatch(batchId, cardNumbers);
};

export const handler = middleware(unwrappedHandler);
