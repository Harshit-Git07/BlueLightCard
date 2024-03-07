import { FirehoseClient, PutRecordCommand, PutRecordCommandInput } from '@aws-sdk/client-firehose';
import { Logger } from '@aws-lambda-powertools/logger';

const logger = new Logger({ serviceName: 'firehose-utils' });

type FireHoseConfig = {
  stream?: string;
  firehoseData: {
    companyId: number;
    offerId?: string;
    memberId: string;
  };
};

export class FirehoseDeliveryStream {
  private readonly firehose;
  constructor() {
    this.firehose = new FirehoseClient({});
  }

  async send(config: FireHoseConfig) {
    const { stream, firehoseData } = config;
    const data = {
      companyId: firehoseData.companyId,
      offerId: firehoseData.offerId,
      memberId: firehoseData.memberId,
      timestamp: new Date().toISOString(),
    };
    logger.info('data', { data });
    logger.info('stream', { stream });
    const input: PutRecordCommandInput = {
      DeliveryStreamName: stream,
      Record: {
        Data: Buffer.from(JSON.stringify(data)),
      },
    };
    const command = new PutRecordCommand(input);

    let response;
    try {
      response = await this.firehose.send(command);
      logger.info('sent to firehose');
      return response;
    } catch (error) {
      logger.error('Error sending to firehose', { error });
    }
  }
}
