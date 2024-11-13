import { DynamoDBClient, BatchWriteItemCommand } from '@aws-sdk/client-dynamodb';
import { ConfiguredRetryStrategy } from '@smithy/util-retry';
import fs from 'fs';

const options = {
  region: 'eu-west-2',
  retryStrategy: new ConfiguredRetryStrategy(5, (attempt) => 200 + attempt * 1000),
};

const client = new DynamoDBClient(options);

let tableName = process.env['MEMBER_TABLE_DYNAMO'];
if (tableName === undefined)
  throw new Error('Please set MEMBER_TABLE_DYNAMO environmental variable for target tabel');

async function batchWriteItems(items) {
  const requestItems = items.map((item) => ({
    PutRequest: {
      Item: {
        pk: {
          S: item.pk,
        },
        sk: {
          S: item.sk,
        },
        StartDate: {
          S: item.StartDate,
        },
        EligibilityStatus: {
          S: item.EligibilityStatus,
        },
        ApplicationReason: {
          S: item.ApplicationReason,
        },
        VerificationMethod: {
          S: item.VerificationMethod,
        },
        Address1: {
          NULL: true,
        },
        Address2: {
          NULL: true,
        },
        City: {
          NULL: true,
        },
        Postcode: {
          NULL: true,
        },
        Country: {
          NULL: true,
        },
        PromoCode: {
          NULL: true,
        },
        IdS3LocationPrimary: {
          NULL: true,
        },
        IdS3LocationSecondary: {
          NULL: true,
        },
        IdLastUploadDate: {
          NULL: true,
        },
        TrustedDomainEmail: {
          NULL: true,
        },
        TrustedDomainEmailCode: {
          NULL: true,
        },
        TrustedDomainValidated: {
          BOOL: false,
        },
        NameChangeReason: {
          NULL: true,
        },
        NameChangeFirstName: {
          NULL: true,
        },
        NameChangeLastName: {
          NULL: true,
        },
        NameChangeDocType: {
          NULL: true,
        },
        RejectionReason: {
          NULL: true,
        },
        Updated: {
          S: item.Updated,
        },
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

async function addApplications() {
  const lines = fs.readFileSync('memberprofiles_applications_upload.json', 'utf-8').split(/\r?\n/);
  const items = lines.map((line) => JSON.parse(line));

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
