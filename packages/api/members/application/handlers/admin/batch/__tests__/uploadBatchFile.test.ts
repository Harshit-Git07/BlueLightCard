import { Context, S3Event, S3EventRecord } from 'aws-lambda';
import { BatchService } from '@blc-mono/members/application/services/batchService';

jest.mock('@blc-mono/members/application/services/batchService');

describe('uploadBatchFile handler', () => {
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
    BatchService.prototype.uploadBatchFile = jest.fn();
  });

  it('should call upload batch file', async () => {
    await handler(event, context);

    expect(BatchService.prototype.uploadBatchFile).toHaveBeenCalledWith(record);
  });
});

async function handler(event: S3Event, context: Context) {
  return (await import('../uploadBatchFile')).handler(event, context);
}
