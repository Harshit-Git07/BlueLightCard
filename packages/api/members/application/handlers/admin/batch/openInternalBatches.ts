import { middleware } from '@blc-mono/members/application/middleware';
import { BatchService } from '@blc-mono/members/application/services/batchService';
import { BatchModel } from '@blc-mono/members/application/models/batchModel';

const service = new BatchService();

const unwrappedHandler = async (): Promise<BatchModel[]> => {
  return await service.openInternalBatches();
};

export const handler = middleware(unwrappedHandler);
