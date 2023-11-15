import {Logger} from '@aws-lambda-powertools/logger';
import {FirehoseClient, PutRecordCommand} from '@aws-sdk/client-firehose';
import {type CloudWatchLogsEvent, type Context} from 'aws-lambda';
import zlib from 'fast-zlib';

const service = process.env.SERVICE;
const logger = new Logger({serviceName: service});
const firehose = new FirehoseClient({});
const unzip = new zlib.Unzip();
export const handler = async (event: CloudWatchLogsEvent, context: Context): Promise<void> => {
    const eventLogs = JSON.parse(JSON.stringify(event));
    if (eventLogs.awslogs.data !== null) {
        const buffer = Buffer.from(eventLogs.awslogs.data, 'base64');
        const logevents = JSON.parse(unzip.process(buffer).toString()).logEvents;
        for (const logevent of logevents) {
            const parsed = JSON.parse(logevent.message);
            logger.info('log', {parsed});
            const data = JSON.stringify({
                mid: parsed.memberId,
                state: 2,
                time: parsed.timestamp,
            });
            const input = {
                DeliveryStreamName: process.env.DATA_STREAM,
                Record: {
                    Data: Buffer.from(data),
                },
            };
            await firehose.send(new PutRecordCommand(input)).catch(function (error) {
                logger.error('err => ', error);
            });
        }
    }
};
