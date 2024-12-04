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
  const parseIdRequirements = (idRequirements) => {
    return {
      M: {
        minimumRequired: { N: idRequirements.minimumRequired.toString() },
        supportedDocuments: {
          L: idRequirements.supportedDocuments.map((doc) => ({
            M: {
              idKey: { S: doc.idKey },
              type: { S: doc.type },
              guidelines: { S: doc.guidelines },
              required: { BOOL: doc.required },
            },
          })),
        },
      },
    };
  };
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
      lastUpdated: { S: item.lastUpdated },
    };

    if (item.type) {
      sanitisedItem.type = { S: item.type };
    }
    if (item.employmentStatus) {
      sanitisedItem.employmentStatus = {
        L: item.employmentStatus.map((status) => ({ S: status })),
      };
    }
    if (item.employedIdRequirements) {
      sanitisedItem.employedIdRequirements = parseIdRequirements(item.employedIdRequirements);
    }
    if (item.retiredIdRequirements) {
      sanitisedItem.retiredIdRequirements = parseIdRequirements(item.retiredIdRequirements);
    }
    if (item.volunteerIdRequirements) {
      sanitisedItem.volunteerIdRequirements = parseIdRequirements(item.volunteerIdRequirements);
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
