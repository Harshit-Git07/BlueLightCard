import { APIGatewayProxyEvent } from 'aws-lambda';
import { ExtendedBatchModel } from '@blc-mono/shared/models/members/batchModel';
import { batchService } from '@blc-mono/members/application/services/batchService';

export function isGetAllBatchesRoute(event: APIGatewayProxyEvent): boolean {
  return event.httpMethod === 'GET' && event.path === `/admin/batches/all`;
}

export async function getAllBatchesHandler(): Promise<ExtendedBatchModel[]> {
  return await batchService().getBatches();
}
