import { APIGatewayProxyEvent } from 'aws-lambda';
import { BatchModel } from '@blc-mono/shared/models/members/batchModel';
import { batchService } from '@blc-mono/members/application/services/batchService';

export function isGetOpenInternalBatchesHandler(event: APIGatewayProxyEvent): boolean {
  return event.httpMethod === 'GET' && event.path === `/admin/batches/internal`;
}

export async function getOpenInternalBatchesHandler(): Promise<BatchModel[]> {
  return await batchService().openInternalBatches();
}
