import { S3Event, S3EventRecord } from 'aws-lambda';
import { BatchService } from '@blc-mono/members/application/services/batchService';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';

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

  beforeEach(() => {
    BatchService.prototype.processInboundBatchFile = jest.fn();
  });

  it('should call upload batch file', async () => {
    await handler(event);

    expect(BatchService.prototype.processInboundBatchFile).toHaveBeenCalledWith(record);
  });
});

async function handler(event: S3Event) {
  return await (await import('../processInboundBatchFile')).handler(event, emptyContextStub);
}
