import { APIGatewayProxyEvent } from 'aws-lambda';
import { middleware } from '../../../middleware';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { BatchService } from '@blc-mono/members/application/services/batchService';

const batchService = new BatchService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<void> => {
  console.log(event);
  const { batchId } = event.pathParameters || {};
  if (!batchId) {
    throw new ValidationError('Batch ID is required');
  }

  return await batchService.fixBatch(batchId);
};

export const handler = middleware(unwrappedHandler);
