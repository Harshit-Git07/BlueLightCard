import { DynamoDBClient, BatchWriteItemCommand } from '@aws-sdk/client-dynamodb';
import { ConfiguredRetryStrategy } from '@smithy/util-retry';
import fs from 'fs';

const options = {
  region: 'eu-west-2',
  retryStrategy: new ConfiguredRetryStrategy(5, (attempt) => 200 + attempt * 1000),
};

const client = new DynamoDBClient(options);

if (!process.env.SST_STAGE) {
  console.error('Please set SST_STAGE environment variable');
  process.exit(1);
}
const tableName = `${process.env.SST_STAGE}-blc-mono-memberProfiles`;

async function batchWriteItems(items) {
  const requestItems = items.map((item) => {
    const sanitisedItem = {
      pk: { S: item.pk },
      sk: { S: item.sk },
      memberId: { S: item.memberId },
      cardNumber: { S: item.cardNumber },
      nameOnCard: { S: item.nameOnCard },
      createdDate: { S: item.createdDate },
      expiryDate: { S: item.expiryDate },
      purchaseDate: { S: item.purchaseDate },
      postedDate: { S: item.postedDate },
      cardStatus: { S: item.cardStatus },
      paymentStatus: { S: item.paymentStatus },
      updated: { S: item.updated },
    };

    if (item.refundedDate) {
      sanitisedItem.refundedDate = { S: item.refundedDate };
    }
    if (item.promoCode) {
      sanitisedItem.promoCode = { S: item.promoCode };
    }

    return { PutRequest: { Item: sanitisedItem } };
  });

  const command = new BatchWriteItemCommand({
    RequestItems: {
      [tableName]: requestItems,
    },
    ReturnConsumedCapacity: 'TOTAL',
  });

  const response = await client.send(command);
  return response;
}

async function addCards() {
  const lines = fs.readFileSync('data/cards.json', 'utf-8').split(/\r?\n/);
  const items = lines
    .filter((line) => line.length > 0 && !line.trim().startsWith('//'))
    .map((line) => JSON.parse(line));

  while (items.length) {
    const batch = items.splice(0, 25);
    try {
      await batchWriteItems(batch);
    } catch (error) {
      console.log('Batch Write Error:', error);
    }
  }
}

addCards();
