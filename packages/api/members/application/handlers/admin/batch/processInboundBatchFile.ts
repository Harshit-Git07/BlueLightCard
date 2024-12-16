import { Context, S3Event } from 'aws-lambda';
import { s3Middleware } from '@blc-mono/members/application/middleware';
import { BatchService } from '@blc-mono/members/application/services/batchService';

const batchService = new BatchService();

export const unwrappedHandler = async (event: S3Event, context: Context): Promise<void> => {
  for (const record of event.Records) {
    await batchService.processInboundBatchFile(record);
  }
};

export const handler = s3Middleware(unwrappedHandler);
