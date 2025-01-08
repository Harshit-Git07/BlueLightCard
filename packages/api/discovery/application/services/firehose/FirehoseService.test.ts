import { FirehoseClient, PutRecordCommand } from '@aws-sdk/client-firehose';
import { mockClient } from 'aws-sdk-client-mock';

import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';

import { DiscoverySearchContext } from '../opensearch/DiscoveryOpenSearchService';

import { FirehoseService } from './FirehoseService';

jest.mock('@blc-mono/core/utils/checkBrand', () => ({
  getBrandFromEnv: jest.fn().mockReturnValue('BLC_UK'),
}));

jest.mock('@blc-mono/core/utils/getEnv', () => ({
  getEnv: jest.fn().mockImplementation((param) => {
    if (param === DiscoveryStackEnvironmentKeys.DWH_FIREHOSE_SEARCH_REQUESTS_STREAM_NAME) {
      return 'mock-stream-name';
    }
  }),
}));

describe('FirehoseService', () => {
  const mockFirehose = mockClient(FirehoseClient);
  const firehoseService = new FirehoseService(mockFirehose as unknown as FirehoseClient);

  describe('logSearchRequest', () => {
    it('should successfully log a search request to Firehose', async () => {
      mockFirehose.on(PutRecordCommand).resolves({ RecordId: 'SuccessId' });
      const searchContext: DiscoverySearchContext = {
        term: 'searchTerm',
        dob: 'dob',
        indexName: 'indexName',
        organisation: 'organisation',
        memberId: 'memberId',
        platform: 'mobile',
      };

      const result = await firehoseService.logSearchRequest(searchContext);

      expect(result).toBe('SuccessId');
      expect(mockFirehose.commandCalls(PutRecordCommand).length).toBe(1);
      const command = mockFirehose.commandCalls(PutRecordCommand)[0].args[0].input;
      expect(command.DeliveryStreamName).toBe('mock-stream-name');
      expect(JSON.parse(new TextDecoder().decode(command.Record?.Data))).toStrictEqual({
        search_id: expect.any(String),
        event_time: expect.any(String),
        brand: 'BLC_UK',
        member_id: 'memberId',
        platform: 'mobile',
        search_term: 'searchTerm',
      });
    });

    it('should not throw an error if the Firehose client throws an error', async () => {
      mockFirehose.on(PutRecordCommand).rejects(new Error('Firehose error'));

      const searchContext: DiscoverySearchContext = {
        term: 'searchTerm',
        dob: 'dob',
        indexName: 'indexName',
        organisation: 'organisation',
        memberId: 'memberId',
        platform: 'mobile',
      };

      const result = await firehoseService.logSearchRequest(searchContext);
      expect(result).toBeUndefined();
    });
  });
});
