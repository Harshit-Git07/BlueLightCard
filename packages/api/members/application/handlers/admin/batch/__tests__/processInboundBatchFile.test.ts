import { S3Event, S3EventRecord, Context } from 'aws-lambda';
import { BatchService } from '@blc-mono/members/application/services/batchService';

jest.mock('@blc-mono/members/application/services/batchService');

describe('processInboundBatchFile handler', () => {
  const record = {
    s3: {
      bucket: {
        name: 'bucketName',
      },
      object: {
        key: 'key',
      },
    },
  } as S3EventRecord;
  const event = { Records: [record] } as S3Event;
  const context = {} as Context;

  beforeEach(() => {
    BatchService.prototype.processInboundBatchFile = jest.fn();
  });

  it('should call upload batch file', async () => {
    await handler(event, context);

    expect(BatchService.prototype.processInboundBatchFile).toHaveBeenCalledWith(record);
  });
});

async function handler(event: S3Event, context: Context) {
  return (await import('../processInboundBatchFile')).handler(event, context);
}
