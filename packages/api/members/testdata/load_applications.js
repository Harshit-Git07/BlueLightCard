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
      applicationId: { S: item.applicationId },
      startDate: { S: item.startDate },
      eligibilityStatus: { S: item.eligibilityStatus },
      applicationReason: { S: item.applicationReason },
      updated: { S: item.updated },
    };

    if (item.rejectionReason) {
      sanitisedItem.rejectionReason = { S: item.rejectionReason };
    }
    if (item.address1) {
      sanitisedItem.address1 = { S: item.address1 };
    }
    if (item.address2) {
      sanitisedItem.address2 = { S: item.address2 };
    }
    if (item.city) {
      sanitisedItem.city = { S: item.city };
    }
    if (item.postcode) {
      sanitisedItem.postcode = { S: item.postcode };
    }
    if (item.country) {
      sanitisedItem.country = { S: item.country };
    }
    if (item.promoCode) {
      sanitisedItem.promoCode = { S: item.promoCode };
    }
    if (item.IdLastUploadDate) {
      sanitisedItem.IdLastUploadDate = { S: item.IdLastUploadDate };
    }
    if (item.trustedDomainEmail) {
      sanitisedItem.trustedDomainEmail = { S: item.trustedDomainEmail };
    }
    if (item.trustedDomainEmailCode) {
      sanitisedItem.trustedDomainEmailCode = { S: item.trustedDomainEmailCode };
    }
    if (item.trustedDomainValidated) {
      sanitisedItem.trustedDomainValidated = { BOOL: item.trustedDomainValidated };
    }
    if (item.nameChangeReason) {
      sanitisedItem.nameChangeReason = { S: item.nameChangeReason };
    }
    if (item.nameChangeFirstName) {
      sanitisedItem.nameChangeFirstName = { S: item.nameChangeFirstName };
    }
    if (item.nameChangeLastName) {
      sanitisedItem.nameChangeLastName = { S: item.nameChangeLastName };
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

async function addApplications() {
  const lines = fs.readFileSync('data/applications.json', 'utf-8').split(/\r?\n/);
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

addApplications();
