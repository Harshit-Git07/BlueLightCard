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
      firstName: { S: item.firstName },
      lastName: { S: item.lastName },
      dateOfBirth: { S: new Date(item.dateOfBirth).toISOString().split('T')[0] },
      employmentStatus: { S: item.employmentStatus },
      gender: { S: item.gender },
      phoneNumber: { S: item.phoneNumber },
      county: { S: item.county },
      email: { S: item.email },
      emailValidated: { BOOL: item.emailValidated },
      spareEmailValidated: { BOOL: false },
      organisationId: { S: item.organisationId },
      employerId: { S: item.employerId },
      jobTitle: { S: item.jobTitle },
      signupDate: { S: item.signupDate },
      status: { S: item.status },
      updated: { S: item.updated },
      updatedBy: { S: item.updatedBy },
    };

    if (item.spareEmail) {
      sanitisedItem.spareEmail = { S: item.spareEmail };
    }
    if (item.employerName) {
      sanitisedItem.employerName = { S: item.employerName };
    }
    if (item.jobReference) {
      sanitisedItem.jobReference = { S: item.jobReference };
    }
    if (item.gaKey) {
      sanitisedItem.gaKey = { S: item.gaKey };
    }
    if (item.lastLogin) {
      sanitisedItem.lastLogin = { S: item.lastLogin };
    }
    if (item.lastIpAddress) {
      sanitisedItem.lastIpAddress = { S: item.lastIpAddress };
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

async function addProfiles() {
  const lines = fs.readFileSync('data/profiles.json', 'utf-8').split(/\r?\n/);
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

addProfiles();
