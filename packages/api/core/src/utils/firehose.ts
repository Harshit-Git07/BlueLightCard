import { FirehoseClient, PutRecordCommand, PutRecordCommandInput } from '@aws-sdk/client-firehose';
import { Logger } from '@aws-lambda-powertools/logger';

type FireHoseConfig = {
  stream: string;
  data: any;
};

export class FirehoseDeliveryStream {
  private readonly firehose;
  constructor(private readonly logger: Logger) {
    this.firehose = new FirehoseClient({});
  }

  async send(config: FireHoseConfig) {
    const input: PutRecordCommandInput = {
      DeliveryStreamName: config.stream,
      Record: {
        Data: Buffer.from(JSON.stringify(config.data)),
      },
    };

    try {
      this.firehose.send(new PutRecordCommand(input));
    } catch (error) {
      this.logger.error('Error sending to firehose', { error });
    }
  }
}
