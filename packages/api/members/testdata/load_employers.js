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
const tableName = `${process.env.SST_STAGE}-blc-mono-memberOrganisations`;

async function batchWriteItems(items) {
  const requestItems = items.map((item) => {
    const sanitisedItem = {
      pk: { S: item.pk },
      sk: { S: item.sk },
      organisationId: { S: item.organisationId },
      employerId: { S: item.employerId },
      name: { S: item.name },
      idUploadCount: { N: item.idUploadCount.toString() },
      bypassPayment: { BOOL: item.bypassPayment },
      bypassId: { BOOL: item.bypassId },
      active: { BOOL: item.active },
      updated: { S: item.updated },
    };

    if (item.type) {
      sanitisedItem.type = { S: item.type };
    }
    if (item.idRequirements) {
      sanitisedItem.idRequirements = { L: JSON.parse(item.idRequirements) };
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

async function addEmployers() {
  const lines = fs.readFileSync('data/employers.json', 'utf-8').split(/\r?\n/);
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

addEmployers();
