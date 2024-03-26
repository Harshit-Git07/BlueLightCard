import {Logger} from '@aws-lambda-powertools/logger';
import {FirehoseClient, PutRecordCommand, PutRecordInput} from '@aws-sdk/client-firehose';
import {type CloudWatchLogsEvent, type Context} from 'aws-lambda';
import zlib from 'fast-zlib';
import {PutRecordCommandInput} from "@aws-sdk/client-firehose/dist-types/commands/PutRecordCommand";
import { LoginAudit } from 'src/models/loginAudits';

const service = process.env.SERVICE;
const webClientId = process.env.WEB_CLIENT_ID;
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
            let state = 0;
            logger.info('log', {parsed});
            if (parsed.action === 'TokenGeneration_Authentication' || parsed.action === 'TokenGeneration_HostedAuth'){
                state = parsed.clientId == webClientId ? LoginAudit.WEB_LOGIN : LoginAudit.APP_LOGIN;
            } else if(parsed.action === 'TokenGeneration_RefreshTokens'){
                state = parsed.clientId == webClientId ? LoginAudit.WEB_REFRESH_TOKEN : LoginAudit.APP_REFRESH_TOKEN;
            }
            if(state !== 0){
                const data = JSON.stringify({
                    mid: parsed.memberId,
                    state: state,
                    time: parsed.timestamp,
                });
                const input: PutRecordCommandInput = {
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
    }
};
