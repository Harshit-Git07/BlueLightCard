import { APIGatewayProxyEvent } from 'aws-lambda';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { batchService } from '@blc-mono/members/application/services/batchService';

export function isFixCardPrintBatchRoute(event: APIGatewayProxyEvent): boolean {
  return (
    event.httpMethod === 'POST' &&
    event.pathParameters !== null &&
    event.pathParameters.batchId !== undefined &&
    event.path === `/admin/cards/batches/${event.pathParameters.batchId}/fix`
  );
}

export async function fixCardPrintBatchHandler(event: APIGatewayProxyEvent): Promise<void> {
  const { batchId } = event.pathParameters || {};
  if (!batchId) {
    throw new ValidationError('Batch ID is required');
  }

  return await batchService().fixBatch(batchId);
}
