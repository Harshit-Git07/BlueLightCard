import { APIGatewayProxyEvent } from 'aws-lambda';
import { CreateInternalBatchModelResponse } from '@blc-mono/shared/models/members/batchModel';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { batchService } from '@blc-mono/members/application/services/batchService';

export function isUpdateInternalBatchRoute(event: APIGatewayProxyEvent): boolean {
  return event.httpMethod === 'PUT' && event.path === `/admin/batches/internal`;
}

export async function updateInternalBatchHandler(
  event: APIGatewayProxyEvent,
): Promise<CreateInternalBatchModelResponse> {
  if (!event.body) {
    throw new ValidationError('Missing request body');
  }

  const { batchId, cardNumbers } = JSON.parse(event.body);
  return await batchService().updateInternalBatch(batchId, cardNumbers);
}
