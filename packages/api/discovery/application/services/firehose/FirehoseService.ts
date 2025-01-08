import { FirehoseClient, PutRecordCommand } from '@aws-sdk/client-firehose';
import { v4 } from 'uuid';

import { getBrandFromEnv } from '@blc-mono/core/utils/checkBrand';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';

import { DiscoverySearchContext } from '../opensearch/DiscoveryOpenSearchService';

const logger = new LambdaLogger({ serviceName: 'firehoseDWH' });

type SearchRequestFirehoseEvent = {
  search_id: string;
  event_time: string;
  search_term: string;
  platform: string;
  member_id: string;
  brand: string;
};

export class FirehoseService {
  private readonly client: FirehoseClient;
  private readonly streamName: string = getEnv(DiscoveryStackEnvironmentKeys.DWH_FIREHOSE_SEARCH_REQUESTS_STREAM_NAME);

  constructor(client = new FirehoseClient()) {
    this.client = client;
  }

  private static mapToSearchRequestFirehoseEvent(context: DiscoverySearchContext): SearchRequestFirehoseEvent {
    return {
      search_id: v4(),
      event_time: new Date().toUTCString(),
      brand: getBrandFromEnv(),
      member_id: context.memberId,
      platform: context.platform,
      search_term: context.term,
    };
  }

  async logSearchRequest(context: DiscoverySearchContext) {
    const searchRequestEvent = FirehoseService.mapToSearchRequestFirehoseEvent(context);
    const command = new PutRecordCommand({
      DeliveryStreamName: this.streamName,
      Record: {
        Data: new TextEncoder().encode(JSON.stringify(searchRequestEvent)),
      },
    });
    try {
      const request = await this.client.send(command);
      logger.info({
        message: `Successfully logged SearchRequest to Firehose with search_id: [${searchRequestEvent.search_id}]`,
      });
      return request.RecordId;
    } catch (err) {
      /* 
          An error is not thrown when the error occurs, but it is logged
          The search request should still be fulfilled if the log
      */
      const message = 'Error trying to log search request to Firehose';
      logger.error({ message, body: err });
    }
  }
}
