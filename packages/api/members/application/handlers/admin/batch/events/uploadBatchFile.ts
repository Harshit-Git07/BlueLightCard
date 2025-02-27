import { S3Event } from 'aws-lambda';
import { BatchService } from '@blc-mono/members/application/services/batchService';
import { s3Middleware } from '@blc-mono/members/application/handlers/shared/middleware/middleware';

const batchService = new BatchService();

export const unwrappedHandler = async (event: S3Event): Promise<void> => {
  for (const record of event.Records) {
    await batchService.uploadBatchFile(record);
  }
};

export const handler = s3Middleware(unwrappedHandler);
