import {Logger} from "@aws-lambda-powertools/logger";
import {EventBridgeEvent} from "aws-lambda";
import {DynamoDBDocumentClient, PutCommand, QueryCommand} from "@aws-sdk/lib-dynamodb";
import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {SendMessageCommand, SQSClient} from "@aws-sdk/client-sqs";
const sqs = new SQSClient({ region: process.env.REGION ?? 'eu-west-2'});

// Function to send a message to SQS Queue
async function sendToDLQ(event: any) {
    const dlqUrl = process.env.DLQ_URL || '';
    const params = {
        QueueUrl: dlqUrl,
        MessageBody: JSON.stringify(event)
    };
    await sqs.send(new SendMessageCommand(params));
}

const service: string = process.env.SERVICE as string
const tableName = process.env.TABLE_NAME as string;
const idMappingTableName = process.env.ID_MAPPING_TABLE_NAME as string;
const logger = new Logger({serviceName: `${service}-companyFollowsUpdate`})
const client = new DynamoDBClient({region: process.env.REGION ?? 'eu-west-2'});
const dynamodb = DynamoDBDocumentClient.from(client);

export const handler = async (event: EventBridgeEvent<any, any>) => {
    logger.info('event received', {event});
    if (!event.detail) {
        logger.error('event detail is missing', {event});
    }
    const input = event.detail as Input;

    //call dynamoDB to map user legacy id to user uuid
    const queryParams = {
        TableName: idMappingTableName,
        KeyConditionExpression: '#legacy_id= :legacy_id',
        ExpressionAttributeValues: {
            ':legacy_id': `BRAND#${input.brand}#${input.legacy_id}`
        },
        ExpressionAttributeNames: {
            '#legacy_id': 'legacy_id',
        },
    };
    const result = await dynamodb.send(new QueryCommand(queryParams));
    if (result.Items === null || result.Items?.length === 0) {
        logger.error('user uuid not found', {input});
    }
    const user = result.Items?.at(0) as Record<string, string>;
    logger.info('user uuid found', {user});
    const putParams = {
        Item: {
            pk: `MEMBER#${user.uuid}`,
            sk: `COMPANYFOLLOWS#${input.company_id}`,
            likeType: input.likeType,
        },
        TableName: tableName
    };
    try {
        const results = await dynamodb.send(new PutCommand(putParams));
        logger.debug('results', { results });
    } catch (err: any) {
        logger.error("error syncing company follows", { err });
        await sendToDLQ(event);
    }
};

type Input = {
    company_id: string;
    likeType: string;
    brand: string;
    legacy_id: string;
}
