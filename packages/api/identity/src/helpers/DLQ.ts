import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

const sqs = new SQSClient({ region: process.env.REGION ?? 'eu-west-2'});

export async function sendToDLQ(event: any) {
    const dlqUrl = process.env.DLQ_URL || '';
    const params = {
      QueueUrl: dlqUrl,
      MessageBody: JSON.stringify(event)
    };
    await sqs.send(new SendMessageCommand(params));
}