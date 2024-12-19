import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { middleware } from '@blc-mono/members/application/middleware';
import { BatchService } from '@blc-mono/members/application/services/batchService';
import { ExtendedBatchModel } from '@blc-mono/members/application/models/batchModel';

const service = new BatchService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<ExtendedBatchModel[]> => {
  return await service.getBatches();
};

export const handler = middleware(unwrappedHandler);
