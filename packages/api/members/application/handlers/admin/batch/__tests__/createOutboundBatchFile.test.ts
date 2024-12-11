import { BatchService } from '@blc-mono/members/application/services/batchService';

jest.mock('@blc-mono/members/application/services/cardService');

describe('createOutboundBatchFile handler', () => {
  beforeEach(() => {
    BatchService.prototype.generateExternalBatchesFile = jest.fn();
  });

  it('should call generate external batches file', async () => {
    await handler();

    expect(BatchService.prototype.generateExternalBatchesFile).toHaveBeenCalled();
  });
});

async function handler() {
  return (await import('../createOutboundBatchFile')).handler();
}
