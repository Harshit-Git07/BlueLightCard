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
      active: { BOOL: item.active },
      bypassPayment: { BOOL: item.bypassPayment },
      bypassVerification: { BOOL: item.bypassVerification },
      cardValidityTerm: { N: item.cardValidityTerm },
      code: { S: item.code },
      createdDate: { S: item.createdDate },
      currentUsages: { N: item.currentUsages },
      description: { S: item.description },
      lastUpdatedDate: { S: item.lastUpdatedDate },
      maxUsages: { N: item.maxUsages },
      name: { S: item.name },
      parentId: { S: item.parentId },
      promoCodeType: { S: item.promoCodeType },
      validityEndDate: { S: item.validityEndDate },
      validityStartDate: { S: item.validityStartDate },
    };

    if (item.codeProvider) {
      sanitisedItem.codeProvider = { S: item.codeProvider };
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

async function addPromoCodesParent() {
  const lines = fs.readFileSync('data/promo_codes_parent.json', 'utf-8').split(/\r?\n/);
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

addPromoCodesParent();
