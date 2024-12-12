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
              title: { S: doc.title },
              description: { S: doc.description },
              guidelines: { S: doc.guidelines },
              required: { BOOL: doc.required },
            },
          })),
        },
      },
    };
  };
  const requestItems = items.map((item) => ({
    PutRequest: {
      Item: {
        pk: { S: item.pk },
        sk: { S: item.sk },
        organisationId: { S: item.organisationId },
        name: { S: item.name },
        type: { S: item.type },
        employmentStatus: { L: item.employmentStatus.map((status) => ({ S: status })) },
        employedIdRequirements: parseIdRequirements(item.employedIdRequirements),
        retiredIdRequirements: parseIdRequirements(item.retiredIdRequirements),
        volunteerIdRequirements: parseIdRequirements(item.volunteerIdRequirements),
        trustedDomains: { L: item.trustedDomains?.map((domain) => ({ S: domain })) ?? [] },
        idUploadCount: { N: item.idUploadCount.toString() },
        bypassPayment: { BOOL: item.bypassPayment },
        bypassId: { BOOL: item.bypassId },
        active: { BOOL: item.active },
        lastUpdated: { S: item.lastUpdated },
      },
    },
  }));

  const command = new BatchWriteItemCommand({
    RequestItems: {
      [tableName]: requestItems,
    },
    ReturnConsumedCapacity: 'TOTAL',
  });

  const response = await client.send(command);
  return response;
}

async function addOrganisations() {
  const lines = fs.readFileSync('data/organisations.json', 'utf-8').split(/\r?\n/);
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

addOrganisations();
