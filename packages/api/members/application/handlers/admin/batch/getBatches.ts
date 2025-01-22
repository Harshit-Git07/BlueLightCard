import { middleware } from '@blc-mono/members/application/middleware';
import { BatchService } from '@blc-mono/members/application/services/batchService';
import { ExtendedBatchModel } from '@blc-mono/shared/models/members/batchModel';

const service = new BatchService();

const unwrappedHandler = async (): Promise<ExtendedBatchModel[]> => {
  return await service.getBatches();
};

export const handler = middleware(unwrappedHandler);
